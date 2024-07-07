'use client';

import { useFormState } from 'react-dom';
import { checkLogin } from '@/lib/auth-actions';
import LoginButton from './login-btn';

const initialState = {
  message: '',
};

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useFormState(checkLogin, undefined);

  return (
    <form className="space-y-4 md:space-y-6" action={formAction}>
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Username"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <LoginButton></LoginButton>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </form>
  );
}
