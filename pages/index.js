import Head from 'next/head';
import Image from 'next/image';
import { getProviders, getSession, useSession } from 'next-auth/react';
import Login from '../components/Login';
import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../firebase';
import MainSection from '../components/MainSection';

export default function Home({ providers }) {
  const { data: session } = useSession();

  if (!session) return <Login providers={providers} />;

  if (session) {
    const userRef = doc(db, 'users', session.user.uid);
    setDoc(
      userRef,
      {
        name: session?.user.name,
        email: session.user.email,
        photoUrl: session.user.image,
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return (
    <div>
      <Head>
        <title>OnlyChads</title>
      </Head>
      <MainSection />
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      providers,
      session,
    },
  };
}
