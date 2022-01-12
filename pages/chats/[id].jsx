import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { channelState } from '../../atoms/channelAtom';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from '../../components/Message';

export default function MessageScreen() {
  const { data: session } = useSession();
  const [channelInfo] = useRecoilState(channelState);
  const router = useRouter();
  const inputRef = useRef('');
  const chatRef = useRef(null);
  const [messages, loading] = useCollection(
    query(
      collection(db, 'channels', channelInfo.channelId, 'messages'),
      orderBy('timestamp', 'asc')
    )
  );

  const scrollToBottom = () => {
    chatRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputRef.current.value !== '') {
      addDoc(collection(db, 'channels', channelInfo.channelId, 'messages'), {
        timestamp: serverTimestamp(),
        message: inputRef.current.value,
        name: session?.user.name,
        photoUrl: session?.user.image,
        email: session?.user.email,
      });
    }
    inputRef.current.value = '';
    scrollToBottom();
  };

  return (
    <div className="flex h-screen flex-col justify-center items-center space-y-4">
      <div className="flex items-start w-11/12">
        <h2
          className=" text-blue-700 cursor-pointer hover:underline"
          onClick={() => {
            router.push('/');
          }}
        >
          Go Back
        </h2>
      </div>
      <div className=" border-2 border-blue-600 w-11/12 h-5/6 rounded-md overflow-y-scroll scrollbar-hide">
        {/* render Messages */}
        {messages?.docs.map((doc) => (
          <Message key={doc.id} id={doc.id} data={doc.data()} />
        ))}
        <div className='"' ref={chatRef}></div>
      </div>
      <div className="flex items-center p-2 border-2 border-blue-600 w-11/12 rounded-lg">
        <form className=" flex-grow">
          <input
            ref={inputRef}
            type="text"
            className=" bg-transparent focus:outline-none text-blue-900 font-bold w-full "
          />
          <button hidden type="submit" onClick={sendMessage}></button>
        </form>
      </div>
    </div>
  );
}
