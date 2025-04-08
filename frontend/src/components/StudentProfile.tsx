// components/StudentProfile.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  enrolledAt: string;
  profileImage?: string;
}

interface Formation {
  id: number;
  title: string;
  description: string;
  duration: number;
  progress?: number;
  startDate?: string;
  completedAt?: string;
}

interface StudentProfileProps {
  studentId: number;
}

export default function StudentProfile({ studentId }: StudentProfileProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Partial<Student>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérifier l'authentification
        const token = localStorage.getItem('studentToken');
        if (!token) {
          router.push('/login');
          return;
        }

        // Configurer les headers avec le token
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Récupérer les informations de l'étudiant
        const studentResponse = await axios.get(`http://localhost:8000/students/${studentId}`, config);
        setStudent(studentResponse.data);
        setEditedStudent(studentResponse.data);

        // Récupérer les formations de l'étudiant
        const formationsResponse = await axios.get(`http://localhost:8000/students/${studentId}/formations`, config);
        setFormations(formationsResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('studentToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`http://localhost:8000/students/${studentId}`, editedStudent, config);
      
      // Mettre à jour les informations affichées
      setStudent(prev => ({
        ...prev!,
        ...editedStudent
      }));
      
      setIsEditing(false);
      setSuccessMessage('Profil mis à jour avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentId');
    router.push('/login');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedStudent(student || {});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Étudiant non trouvé.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
              )}
            </div>
            
            {!isEditing && (
              <>
                <h2 className="text-xl font-semibold text-center mb-2">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-gray-600 text-center mb-6">{student.email}</p>
                
                <div className="w-full space-y-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Modifier le profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            )}

            {isEditing && (
              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editedStudent.firstName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editedStudent.lastName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editedStudent.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="w-1/2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="w-1/2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="md:w-2/3 p-6">
            <h3 className="text-lg font-semibold mb-4">Détails du compte</h3>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date d'inscription</p>
                  <p>{new Date(student.enrolledAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre de formations</p>
                  <p>{formations.length}</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Formations</h3>
            
            {formations.length === 0 ? (
              <p className="text-gray-500 italic">Aucune formation inscrite.</p>
            ) : (
              <div className="space-y-4">
                {formations.map((formation) => (
                  <div key={formation.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <h4 className="font-medium mb-1">{formation.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{formation.description}</p>
                    
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Durée: {formation.duration} heures</span>
                      {formation.startDate && (
                        <span>Commencé le: {new Date(formation.startDate).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                    
                    {formation.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>{formation.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${formation.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {formation.completedAt && (
                      <p className="text-sm text-green-600 mt-2">
                        Terminé le: {new Date(formation.completedAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}