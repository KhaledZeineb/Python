// app/formations/page.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Formation {
  id: number;
  title: string;
  description: string;
  duration: number;
}

export default function FormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [enrolledFormations, setEnrolledFormations] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('studentToken');
      const id = localStorage.getItem('studentId');

      if (token && id) {
        setIsLoggedIn(true);
        setStudentId(Number(id));
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        // Charger toutes les formations
        const formationsResponse = await axios.get('http://localhost:8000/formations');
        setFormations(formationsResponse.data);

        // Si l'utilisateur est connecté, charger ses formations
        const token = localStorage.getItem('studentToken');
        const id = localStorage.getItem('studentId');
        if (token && id) {
          const enrolledResponse = await axios.get(`http://localhost:8000/students/${id}/formations`);
          const enrolledIds = enrolledResponse.data.map((f: Formation) => f.id);
          setEnrolledFormations(enrolledIds);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des formations:', error);

        // Check if it's a network error
    if (error.message === 'Network Error') {
      setError('Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est en cours dexécution.');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      setError(`Erreur ${error.response.status}: ${error.response.data?.message || 'Une erreur est survenue'}`);
    } else {
      setError('Une erreur est survenue lors du chargement des formations.');
    }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchData();
  }, []);

  const handleEnroll = async (formationId: number) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await axios.post(`http://localhost:8000/students/${studentId}/enroll/${formationId}`);
      setEnrolledFormations([...enrolledFormations, formationId]);
      setSuccess('Inscription réussie !');
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      if (error.response && error.response.status === 400) {
        setError('Vous êtes déjà inscrit à cette formation.');
      } else {
        setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    }
  };

  const handleUnenroll = async (formationId: number) => {
    setError('');
    setSuccess('');

    try {
      await axios.delete(`http://localhost:8000/students/${studentId}/unenroll/${formationId}`);
      setEnrolledFormations(enrolledFormations.filter(id => id !== formationId));
      setSuccess('Désinscription réussie !');
    } catch (error) {
      console.error('Erreur lors de la désinscription:', error);
      setError('Erreur lors de la désinscription. Veuillez réessayer.');
    }
  };

  const isEnrolled = (formationId: number) => {
    return enrolledFormations.includes(formationId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Chargement des formations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Formations disponibles</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {formations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Aucune formation disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {formations.map((formation) => (
            <div key={formation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{formation.title}</h2>
                <p className="text-gray-600 mb-4">{formation.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm">Durée: {formation.duration} heures</p>
                  {isLoggedIn ? (
                    isEnrolled(formation.id) ? (
                      <button
                        onClick={() => handleUnenroll(formation.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Se désinscrire
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(formation.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        S'inscrire
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => router.push('/login')}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Connexion requise
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}