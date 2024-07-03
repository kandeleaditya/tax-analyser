import { signOut } from "next-auth/react"

export default function LogoutButton(){
    return <button className="block" onClick={() => {signOut()}}>
    Logout
  </button>
}