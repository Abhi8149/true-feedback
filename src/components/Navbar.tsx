'use client';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = session?.user;

  return (

<div>
  <nav className="flex justify-between items-center bg-black text-white px-4 sm:px-6 py-4">
    <div className="flex items-center space-x-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <h1 className="text-xl sm:text-2xl font-bold tracking-wider">
        True Feedback
      </h1>
    </div>

    <div className="hidden md:flex items-center space-x-4">
      {session ? (
        <div className="flex items-center space-x-4">
          <h2 className="text-base sm:text-lg font-medium text-cyan-300">
            Welcome {user?.email?.split('@')[0]}
          </h2>
          <Link href="/dashboard" className="text-base sm:text-lg font-medium text-cyan-300">
            Dashboard
          </Link>
          <Button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </Button>
        </div>
      ) : (
        <Link href="/sign-in" passHref>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
            Login
          </Button>
        </Link>
      )}
    </div>

    {/* Mobile Menu Toggle */}
    <div className="md:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    {isMenuOpen && (
      <div className="absolute top-16 left-0 w-full bg-black text-white p-4 flex flex-col items-center space-y-4 md:hidden">
        {session ? (
          <>
            <h2 className="text-lg font-medium text-cyan-300">
              Welcome {user?.name}
            </h2>
            <Link
              href="/dashboard"
              className="text-lg font-medium text-cyan-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Button
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in" passHref>
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    )}
  </nav>
</div>


  );
};

export default Navbar;