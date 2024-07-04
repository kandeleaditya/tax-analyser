'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const initialState = {
  message: '',
};

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAuth = (event: React.MouseEvent<HTMLButtonElement>) => {
    signIn(event.currentTarget.name, { callbackUrl: '/dashboard' });
  };

  const handleCredentials = async (formData: FormData) => {
    const response = await signIn('credentials', {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    if (response && response.error) {
      setErrorMessage('Incorrect Username or Password');
      console.log(response.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form
      className="space-y-4 md:space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleCredentials(new FormData(e.target as HTMLFormElement));
      }}
    >
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
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Login
      </button>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </form>
  );
}
