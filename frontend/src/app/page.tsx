// app/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-6 text-center">Bienvenue sur la plateforme de gestion des étudiants</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Notre plateforme vous permet de gérer vos inscriptions, 
        suivre vos formations et plus encore.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => router.push('/formations')}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
        >
          Voir les formations
        </button>
        <Link href="/login" className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md">
          Se connecter
        </Link>
      </div>
    </div>
  );
}