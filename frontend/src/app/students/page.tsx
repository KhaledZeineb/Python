//students.tsx
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


interface Student {
  id: number;
  name: string;
  age: number;
  major: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:8000/students')
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error('Il y a eu une erreur!', error);
      });
  }, []);

  const deleteStudent = (id: number) => {
    axios.delete(`http://localhost:8000/students/${id}`)
      .then(() => {
        setStudents(students.filter(student => student.id !== id));
      })
      .catch((error) => {
        console.error('Erreur de suppression', error);
      });
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
    <h1 className="text-3xl font-extrabold mb-8 text-[#4B4B4B] leading-tight">Liste des étudiants</h1>

  
      {students.length === 0 ? (
        <p className="text-[#CED4DA] italic">Aucun étudiant trouvé. Ajoutez-en un pour commencer.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((student) => (
            <li key={student.id} className="bg-[#343A40] text-[#F8F9FA] p-4 rounded shadow-lg">
              <p className="font-semibold text-[#E9ECEF]">{student.name}</p>
              <p className="text-[#ADB5BD]">{student.age} ans</p>
              <p className="text-[#ADB5BD]">{student.major}</p>
              <button
                onClick={() => deleteStudent(student.id)}
                className="bg-[#D6336C] hover:bg-[#B02A52] text-white py-1 px-2 rounded mt-2 shadow"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
  
}
