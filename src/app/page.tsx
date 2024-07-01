import { redirect } from 'next/navigation'

export default function Page() {
    redirect('/login')
    /* try{
        redirect('/login')
    }
    catch (error){
        console.error('Login Error:', error);
    } */
}
