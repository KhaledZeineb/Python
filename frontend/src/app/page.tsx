// page.tsx
"use client";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Gestion des étudiants</h1>

      <div className="mb-4">
        <button
          onClick={() => router.push('/students')} // Rediriger vers la liste des étudiants
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Voir les étudiants
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => router.push('/addstudent')} // Rediriger vers la page d'ajout
          className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Ajouter un étudiant
        </button>
      </div>
    </div>
  );
}
