'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function checkLogin(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logout() {
  console.log('adi logout');
  await signOut();
}

/* 'use server'
import {signOut} from "next-auth/react"


export async function checkLogin(prevState: any, formData: FormData){
    try{
    
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        let errors = [];

        if(!username || username.trim().length === 0){
            errors.push('username is required')
        }

        if(!password || password.trim().length === 0){
            errors.push('password is required')
        }

        if(errors.length > 0){
            return {
                errors
            }
        }
    }catch(error){

    }

}

export async function logout() {
    signOut();
} */
