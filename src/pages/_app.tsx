import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { api } from "../utils/api";
import "../styles/globals.css";
import { NextComponentType, NextPageContext } from "next";
import { FC } from "react";
import { useRouter } from 'next/router'
import Layout from "../components/layout/Layout";
import { Loader } from "../components/loader/Loader";

type MyComponentType = NextComponentType & {auth: boolean}
// AppType<{ session: Session | null }>
const App =
  ({Component, pageProps: { session, ...pageProps }}: {Component: MyComponentType, pageProps: { session: Session | null} }) => {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  )
}

const Auth: FC<{children: JSX.Element}> = ({ children }) => {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const router = useRouter()
  const { status } = useSession({ required: true,
    onUnauthenticated() {
      void router.push('/api/auth/signin?callbackUrl='+window.location.href)
    }})

  if (status === "loading") {
    return <div className="flex justify-center">
      <Loader />
    </div>
  }

  return children
}

export default api.withTRPC(App);
