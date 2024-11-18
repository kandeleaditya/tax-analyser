import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { getUserDB } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const username = credentials.username;
        const password = credentials.password;

        const user = await getUserDB(username);

        if (user) {
          const passwordsMatch = verifyPassword(user.password, password);
          if (passwordsMatch) {
            const userAvailable = {
              id: user.id.toString(),
              username: user.username,
              name: user.name,
              email: user.email,
              phone: user.phone,
              status: user.status,
              planEndDate: user.planEndDate,
              dbPrefix: user.dbPrefix,
              password: user.password,
            };

            return userAvailable;
          }
        }

        return null;
      },
    }),
  ],
});
