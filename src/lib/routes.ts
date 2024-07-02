export const privateRoutes: string[] = [
    '/dashboard',
    '/priv'
  ];
  
  export const authRoutes: string[] = [
    '/login',
    '/api/auth/signin'
  ];
  
  // When user is not logged in and tries to access protected routes redirect to login page
  export const DEFAULT_REDIRECT_LOGIN_URL: string = '/login';
  
  // When user is logged in and tries to access login page redirect to dashboard
  export const DEFAULT_REDIRECT_HOME_URL: string = '/dashboard';