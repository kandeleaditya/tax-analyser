'use client';

import React, { useRef } from 'react';
import LogoutButton from './logout-btn';
import Link from 'next/link';

export default function SidePanel() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const barsIconRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        id="sidebarToggle"
        className="md:hidden focus:outline-none absolute top-5 left-1"
        ref={barsIconRef}
        onClick={function (e) {
          sidebarRef.current?.classList.toggle('hidden');
          (e.target as HTMLButtonElement)?.closest('button')?.classList.toggle('hidden');
        }}
      >
        <i className="fas fa-bars fa-lg"></i>
      </button>
      {/* <!-- Side Panel --> */}
      <div className="flex flex-col h-screen bg-gray-800 text-white md:block" ref={sidebarRef}>
        <div className="py-4 px-6 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Tax Analyser</h1>
          <button
            id="sidebarToggle"
            className="block md:hidden focus:outline-none absolute top-5 left-1"
            onClick={function (e) {
              sidebarRef.current?.classList.toggle('hidden');
              barsIconRef.current?.classList.toggle('hidden');
            }}
          >
            <i className="fas fa-close fa-lg"></i>
          </button>
        </div>
        <nav id="sidebar" className="lg:block lg:h-auto lg:pb-0">
          <ul className="my-8">
            <li className="py-2 px-6 hover:bg-gray-700">
              <Link href="/dashboard" className="block">
                Home
              </Link>
            </li>
            <li className="py-2 px-6 hover:bg-gray-700">
              <Link href="/dashboard/upload_excel" className="block">
                Upload Excel
              </Link>
            </li>
          </ul>
        </nav>
        <div className="py-4 px-6 border-t border-gray-700">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
