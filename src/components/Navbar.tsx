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
            Welcome {user?.username}
          </h2>
          <Link href="/dashboard" className="text-base sm:text-lg font-medium text-cyan-300">
            <Button className='bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105'>
            dashboard
              
            </Button>
          </Link>
          <Button
            onClick={() => signOut()
            }
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

{/* Mobile Menu Button */}
<div className="md:hidden">
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white transition-transform duration-200 ease-in-out"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }}
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

{/* Mobile Menu */}
<div 
  className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
    isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
>
  {/* Backdrop */}
  <div 
    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
    onClick={() => setIsMenuOpen(false)}
  />
  
  {/* Menu Content */}
  <div 
    className={`absolute top-16 left-0 w-full transform transition-transform duration-300 ease-in-out ${
      isMenuOpen ? 'translate-y-0' : '-translate-y-full'
    }`}
  >
    <div className="mx-4 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 space-y-4">
        {session ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black text-center">
                Welcome, <span className="text-cyan-600">{user?.username}</span>
              </h2>
            </div>
            
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 px-4 text-center text-black hover:bg-gray-200 rounded-md transition-colors "
            >
              Dashboard
            </Link>
            
            <div className="pt-2 border-t border-gray-200">
              <Button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-all duration-300 transform hover:scale-[0.98]"
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <Link href="/sign-in" passHref>
            <Button
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md transition-all duration-300 transform hover:scale-[0.98]"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  </div>
</div>
  
  </nav>
</div>


  );
};

export default Navbar;