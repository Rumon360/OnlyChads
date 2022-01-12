import { useSession } from 'next-auth/react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { channelState } from '../atoms/channelAtom';

export default function Chat({ id, users }) {
  const { data: session } = useSession();
  const router = useRouter();
  const recipientEmail = users.find((user) => user != session?.user.email);
  const userChatRef = query(
    collection(db, 'users'),
    where('email', '==', recipientEmail)
  );
  const [chatsSnapshot, loading] = useCollection(userChatRef);
  const data = chatsSnapshot?.docs[0].data();
  const [channelInfo, setChannelInfo] = useRecoilState(channelState);

  return (
    <div
      onClick={() => {
        setChannelInfo({ channelId: id });
        router.push(`/chats/${id}`);
      }}
      className=" flex space-x-3 items-center p-4 border-b border-blue-500 cursor-pointer hover:bg-slate-200"
    >
      <div>
        <img
          className=" h-20 rounded-full border-2 border-blue-600"
          src={data?.photoUrl}
          alt=""
        />
      </div>
      <div>
        <h2 className=" font-bold text-xl text-blue-800">{data?.name}</h2>
        <h4 className=" text-blue-600">{data?.email}</h4>
      </div>
    </div>
  );
}
