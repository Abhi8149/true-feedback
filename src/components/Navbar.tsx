'use client';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import Link from 'next/link';

const Navbar = () => {
  const { data: session } = useSession();

  // Optional: You can check if user exists and handle it accordingly
  const user = session?.user;

  return (

    // @claude-sonnet-3.5
<div>
  <nav className='flex justify-between items-center bg-black text-white'>
    <div className='ml-5 p-3 text-2xl font-bold tracking-wider flex items-center'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      True Feedback
    </div>
    <div className='mr-5 flex items-center space-x-4'>
      {session ? (
        <div className='flex items-center space-x-4'>
          <h2 className='text-lg font-medium text-cyan-300'> 
            Welcome {user?.email?.split('@')[0]}
          </h2>
          <Link href='/dashboard' className='text-lg font-medium text-cyan-300'> 
            dashboard
          </Link>
          <Button 
            onClick={() => signOut()}
            className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105'
          >
            Logout
          </Button>
        </div>
      ) : (
        <Link href='/sign-in' passHref>
          <Button className='bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105'>
            Login
          </Button>
        </Link>
      )}
    </div>
  </nav>
</div>

  );
};

export default Navbar;