import { signOut, useSession } from 'next-auth/react';
import * as EmailValidator from 'email-validator';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import Chat from './Chat';

export default function MainSection() {
  const { data: session } = useSession();

  const userChatRef = query(
    collection(db, 'channels'),
    where('users', 'array-contains', session?.user.email)
  );

  const [chatsSnapshot, loading] = useCollection(userChatRef);

  const checkUserExists = async (recipientEmail) => {
    const q = query(
      collection(db, 'users'),
      where('email', '==', recipientEmail)
    );
    const querySnapshot = await getDocs(q).then((result) => {
      if (result.docs.length > 0) {
        return true;
      } else {
        alert('Not A Chad');
        return false;
      }
    });
    return querySnapshot;
  };

  const channelAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find((chat) =>
      chat.data().users.find((user) => user === recipientEmail)
    );

  const createChad = () => {
    const recipientEmail = prompt('Put the email of the chad');
    if (!recipientEmail) return null;
    if (
      EmailValidator.validate(recipientEmail) &&
      session?.user.email != recipientEmail &&
      !loading &&
      !channelAlreadyExists(recipientEmail)
    ) {
      checkUserExists(recipientEmail).then((result) => {
        if (result === true) {
          addDoc(collection(db, 'channels'), {
            users: [recipientEmail, session?.user.email],
          });
        } else {
          console.log('This User is not a CHAD');
        }
      });
    } else {
      alert('Invalid Email or Chat Already Exists');
    }
  };

  return (
    <div className=" flex flex-col space-y-4 h-screen justify-center items-center ">
      <div className=" border-2 border-blue-600 rounded-md h-[600px] w-[480px] md:w-[900px] overflow-y-scroll scrollbar-hide">
        {/* Loggin in user Info */}
        <div className=" flex space-x-3 items-center p-4 border-b border-blue-500">
          <div>
            <img
              onClick={() => {
                signOut();
              }}
              src={session?.user?.image}
              alt=""
              className=" h-20 rounded-full border-2 cursor-pointer border-blue-600"
            />
          </div>
          <div>
            <h2 className=" font-bold text-xl text-blue-800">
              {session?.user?.name}
            </h2>
            <h4 className=" text-blue-600">{session?.user?.email}</h4>
          </div>
        </div>
        <div className="flex justify-center p-4 border-b border-blue-500">
          <h2 className="font-bold text-4xl text-blue-800">Fellow Chads</h2>
        </div>
        {/* Chads List */}
        {loading ? (
          <h1 className="font-bold text-4xl text-blue-800 flex items-center justify-center pt-20 animate-ping">
            Loading
          </h1>
        ) : (
          chatsSnapshot?.docs.map((doc) => (
            <Chat key={doc.id} id={doc.id} users={doc.data().users} />
          ))
        )}
      </div>
      <button
        onClick={createChad}
        className="relative inline-block text-lg group"
      >
        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
          <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
          <span className="relative">Add A Chad</span>
        </span>
        <span
          className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
          data-rounded="rounded-lg"
        ></span>
      </button>
    </div>
  );
}
