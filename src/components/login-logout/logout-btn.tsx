//import { signOut } from '@/auth';

import { logout } from '@/lib/auth-actions';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button className="block">Logout</button>
    </form>
  );
}

/* export default function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button className="block">Logout</button>
    </form>
  );
} */
