// components/AuthForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        // Validation
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas.');
          setLoading(false);
          return;
        }

        const response = await axios.post('http://localhost:8000/register', {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });

        if (response.data.token) {
          localStorage.setItem('studentToken', response.data.token);
          localStorage.setItem('studentId', response.data.id);
          router.push('/formations');
        }
      } else {
        // Login logic
        const response = await axios.post('http://localhost:8000/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.data.token) {
          localStorage.setItem('studentToken', response.data.token);
          localStorage.setItem('studentId', response.data.id);
          router.push('/formations');
        }
      }
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(mode === 'login' ? 
          'Échec de la connexion. Veuillez vérifier vos identifiants.' : 
          'Échec de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Connexion' : 'Inscription'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {mode === 'register' && (
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 
            (mode === 'login' ? 'Connexion...' : 'Inscription...') : 
            (mode === 'login' ? 'Se connecter' : 'S\'inscrire')}
        </button>
      </form>

      <div className="mt-6 text-center">
        {mode === 'login' ? (
          <p className="text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <a 
              href="/register" 
              className="text-blue-500 hover:text-blue-700"
              onClick={(e) => {
                e.preventDefault();
                router.push('/register');
              }}
            >
              Inscrivez-vous
            </a>
          </p>
        ) : (
          <p className="text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a 
              href="/login" 
              className="text-blue-500 hover:text-blue-700"
              onClick={(e) => {
                e.preventDefault();
                router.push('/login');
              }}
            >
              Connectez-vous
            </a>
          </p>
        )}
      </div>
    </div>
  );
}