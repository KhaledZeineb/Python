//addStudent.tsx
"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function AddStudentPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [major, setMajor] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentData = {
      name,
      age: Number(age),
      major,
    };

    axios.post('http://localhost:8000/students', studentData)
      .then(() => {
        router.push('/students'); // Rediriger vers la liste des étudiants après l'ajout
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout de l\'étudiant', error);
      });
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Ajouter un étudiant</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
      <label htmlFor="name" className="block text-black">Nom :</label>

  <input
    id="name"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full p-2 rounded bg-gray-200 text-black"
    required
  />
</div>

<div>
<label htmlFor="age" className="block text-black">Âge :</label>
  <input
    id="age"
    type="number"
    value={age}
    onChange={(e) => setAge(e.target.value)}
    className="w-full p-2 rounded bg-gray-200 text-black"
    required
  />
</div>

<div>
<label htmlFor="major" className="block text-black">Spécialité :</label>
  <input
    id="major"
    type="text"
    value={major}
    onChange={(e) => setMajor(e.target.value)}
    className="w-full p-2 rounded bg-gray-200 text-black"
  />
</div>

        <div>
          <button
            type="submit"
            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
}
