import type { NextAuthConfig } from 'next-auth';
import { redirect } from 'next/navigation';
//import { auth } from './auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl }, request }) {
      console.log('adi authorized auth', auth);
      //console.log('adi authorized request', request);
      console.log('adi authorized nextUrl', nextUrl);
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      console.log('adi isOnDashboard', isOnDashboard);
      console.log('adi isLoggedIn', isLoggedIn);
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        //else return redirect('/login');
        //return Response.redirect(new URL('/', nextUrl));
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        //redirect('/dashboard');
        // return Response.redirect(new URL('/dashboard', nextUrl));
        // ToDo: Redirect to dashboard in the url as well
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
