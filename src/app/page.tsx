import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Page() {
  const translation = useTranslations('home');

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold mb-4">{translation('welcome')}</h1>
          <p className="text-gray-600 mb-6">{translation('description')}</p>
          <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            {translation('login_btn')}
          </Link>
        </div>
      </div>
    </>
  );
}
