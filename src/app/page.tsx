import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold mb-4">Welcome to Tax Analyzer</h1>
          <p className="text-gray-600 mb-6">
            Analyze your taxes with ease using our powerful app. Get started today by login!
          </p>
          <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    </>
  );
}
