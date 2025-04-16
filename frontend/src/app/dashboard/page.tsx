// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface Formation {
  id: number;
  title: string;
  description: string;
  duration: number;
}

export default function DashboardPage() {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState<number | null>(null);
  const [enrolledFormations, setEnrolledFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('studentToken');
      const id = localStorage.getItem('studentId');
      const name = localStorage.getItem('studentName');

      if (!token || !id) {
        router.push('/login');
        return;
      }

      setStudentName(name || '');
      setStudentId(Number(id));
      
      // Charger les formations de l'étudiant
      fetchEnrolledFormations(Number(id));
    };

    checkAuth();
  }, [router]);

  const fetchEnrolledFormations = async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/students/${id}/formations`);
      setEnrolledFormations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (formationId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir vous désinscrire de cette formation ?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8000/students/${studentId}/unenroll/${formationId}`);
      // Actualiser la liste des formations
      fetchEnrolledFormations(studentId!);
    } catch (error) {
      console.error('Erreur lors de la désinscription:', error);
      alert('Erreur lors de la désinscription. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Bienvenue, {studentName} !</h2>
        <p className="mb-4 text-gray-700">
          Voici votre espace personnel où vous pouvez gérer vos formations et consulter votre profil.
        </p>

        
        <div className="flex flex-wrap gap-4 mt-6">
          <Link href="/profile" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Voir mon profil
          </Link>
          <Link href="/formations" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
            Explorer les formations
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4  text-gray-900">Mes formations</h2>
        
        {enrolledFormations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">Vous n'êtes inscrit à aucune formation.</p>
            <Link href="/formations" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              Parcourir les formations
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledFormations.map((formation) => (
              <div key={formation.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium  text-gray-300">{formation.title}</h3>
                  <p className="text-gray-600 text-sm">{formation.description}</p>
                  <p className="text-gray-500 text-xs mt-1">Durée: {formation.duration} heures</p>
                </div>
                <button
                  onClick={() => handleUnenroll(formation.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                >
                  Se désinscrire
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}