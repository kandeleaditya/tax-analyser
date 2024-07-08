import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { getUserDB } from '@/lib/db';
import userData from '@/dummy.json';
import { verifyPassword } from '@/lib/password';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const username = credentials.username;
        const password = credentials.password;

        console.log(username);
        console.log(password);

        const user = await getUserDB(username);
        console.log('adi auth.ts user', user);
        const passwordsMatch = verifyPassword(user.password, password);
        console.log('adi auth.ts passwordsMatch', passwordsMatch);

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
});

/* import NextAuth from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

import { getUserDB } from '@/lib/db';

import userData from '@/dummy.json';

export const { handlers, auth } = NextAuth({
export const { handlers, auth } = NextAuth({
  session: { strategy: 'jwt' },

  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
        password: {},
      },

      async authorize(credentials) {
        const username = credentials.username;
        const password = credentials.password;

        console.log(username);
        console.log(password);

        let flag = false;
        let user = {};

        // let userResult = getUserDB(username);
        // console.log('adi userResult', userResult);

        for (var index in userData.users) {
          let record = userData.users[index];

          if (record.username == username) {
            if (record.password == password) {

          if (record.username == username) {
            if (record.password == password) {
              user = {
                id: record.id,
                name: record.username,
              };
              flag = true;
              };
              flag = true;
              break;
            }
            }
          }
        }

        if (flag) {
        if (flag) {
          return user;
        }

        return null;
      },
    }),
      },
    }),
  ],
});
 */
