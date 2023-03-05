import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Navbar = () => {
  return (<header className="flex h-20 bg-[#15162c] text-[#ffffff] justify-between items-center px-10">
    <nav>
      <Link href="/" className="mr-3">Home</Link>
      <Link href="/create-article" className="mr-3">Create Article</Link>
      <Link href="/blog" className="mr-3">Blog</Link>
      <Link href="/about">About</Link>
    </nav>
    <AuthShowcase />
  </header>);
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await router.push('/')
    void signOut()
  }

  const handleLogin = () => {
    void signIn()
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <p className="text-center text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20 rounded"
        onClick={sessionData ? handleLogout : handleLogin}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
