import { auth } from "@/auth";

import { privateRoutes, 
    authRoutes, 
    DEFAULT_REDIRECT_LOGIN_URL, 
    DEFAULT_REDIRECT_HOME_URL } from '@/lib/routes';

export default auth((req) => {
    const url = req.nextUrl;
    const route = req.nextUrl.pathname;
    
    const isLoggedIn = !!req.auth;
    
    //console.log(route);
    
    function checkAuthRoute(authRoute: string) {
        if(route.startsWith(authRoute)) {
        return true;
        }
        return;
    }
    
    //console.log(!!authRoutes.filter(checkAuthRoute).length);
    
    if(!!authRoutes.filter(checkAuthRoute).length) {
        if(isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_REDIRECT_HOME_URL, url));
        } 
        return;    
    }

    // Typescript does not supprt spread operator as of now
    function startsWithAny(str: string, prefixes: string[]): boolean {
        return prefixes.some(prefix => str.startsWith(prefix));
      }
    
    if(startsWithAny(route, authRoutes)) {
        if(isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_REDIRECT_HOME_URL, url));
        } 
        return;       
    }
    
    if(privateRoutes.includes(route)) {
        if(!isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_REDIRECT_LOGIN_URL, url));
        }
        return;
    }
    
    return;
    
    })

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}