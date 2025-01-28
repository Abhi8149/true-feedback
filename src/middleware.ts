import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const pathname=request.nextUrl.pathname;
  const token=await getToken({req:request});
  const pages=(pathname==='/sign-up' || pathname==='/sign-in' || pathname==='/verify' || pathname==='/')

  if(token && pages){
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if(!token && pathname==='/dasboard'){
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/sign-in','/sign-up','/verify/:path*','/dashboard/:path']
}