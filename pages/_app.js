import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
