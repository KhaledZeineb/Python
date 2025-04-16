// app/profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Department {
  id: number;
  name: string;
}

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  age: number;
  major: string;
  department_id: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    major: '',
    department_id: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('studentToken');
      const id = localStorage.getItem('studentId');

      if (!token || !id) {
        router.push('/login');
        return;
      }

      try {
        // Charger les départements
        const deptResponse = await axios.get('http://localhost:8000/departments');
        setDepartments(deptResponse.data);
        
        // Charger le profil de l'étudiant
        const profileResponse = await axios.get(`http://localhost:8000/students/${id}`);
        setProfile(profileResponse.data);
        setFormData({
          name: profileResponse.data.name,
          age: profileResponse.data.age.toString(),
          major: profileResponse.data.major || '',
          department_id: profileResponse.data.department_id.toString()
        });
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updateData = {
        name: formData.name,
        age: Number(formData.age),
        major: formData.major,
        department_id: Number(formData.department_id),
        email: profile?.email,
        password: 'placeholder' // Le backend ne modifiera pas le mot de passe
      };

      await axios.put(`http://localhost:8000/students/${profile?.id}`, updateData);
      
      // Mettre à jour le profil local
      setProfile({
        ...profile!,
        name: formData.name,
        age: Number(formData.age),
        major: formData.major,
        department_id: Number(formData.department_id)
      });
      
      // Mettre à jour le nom dans le localStorage
      localStorage.setItem('studentName', formData.name);
      
      setSuccess('Profil mis à jour avec succès');
      setEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
    }
  };

  const getDepartmentName = (id: number) => {
    const department = departments.find(dept => dept.id === id);
    return department ? department.name : 'Non spécifié';
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
      
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
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-1">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={profile?.email}
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="age" className="block text-gray-700 mb-1">Âge</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="major" className="block text-gray-700 mb-1">Spécialité</label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="department_id" className="block text-gray-700 mb-1">Département</label>
              <select
                id="department_id"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Sélectionnez un département</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
  <div className="border-b border-gray-200 pb-2">
    <p className="text-sm text-gray-500">Nom complet</p>
    <p className="font-medium text-black">{profile?.name}</p>
  </div>

  <div className="border-b border-gray-200 pb-2">
    <p className="text-sm text-gray-500">Email</p>
    <p className="font-medium text-black">{profile?.email}</p>
  </div>

  <div className="border-b border-gray-200 pb-2">
    <p className="text-sm text-gray-500">Âge</p>
    <p className="font-medium text-black">{profile?.age} ans</p>
  </div>

  <div className="border-b border-gray-200 pb-2">
    <p className="text-sm text-gray-500">Spécialité</p>
    <p className="font-medium text-black">{profile?.major || 'Non spécifiée'}</p>
  </div>

  <div className="pb-2">
    <p className="text-sm text-gray-500">Département</p>
    <p className="font-medium text-black">{getDepartmentName(profile?.department_id || 0)}</p>
  </div>
</div>

            
            <div className="mt-6">
              <button
                onClick={() => setEditing(true)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Modifier mon profil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}