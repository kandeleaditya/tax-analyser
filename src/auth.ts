import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import userData from '@/dummy.json';

export const {
  handlers,
  auth,
} = NextAuth({
  session: { strategy: 'jwt' },

  providers: [
    CredentialsProvider({

      credentials: {
        username: {},
        password: {}
      },

      async authorize(credentials) {

        const username = credentials.username;
        const password = credentials.password;

        console.log(username);
        console.log(password);

        let flag=false;
        let user = {}

        for (var index in userData.users) {

          let record = userData.users[index];
          
          if(record.username==username) {
            if(record.password==password) {
              user = {
                id: record.id,
                name: record.username,
              }
              flag=true;
              break;
            } 
          }
        }

        if(flag) {
          return user;
        }

        return null;

      }
    })
  ],
})