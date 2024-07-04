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
