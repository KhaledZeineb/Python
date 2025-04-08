// components/FormationCard.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Formation {
  id: number;
  title: string;
  description: string;
  duration: number;
  instructor?: string;
  category?: string;
  level?: string;
  rating?: number;
  enrolled?: number;
  image?: string;
}

interface FormationCardProps {
  formation: Formation;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  onEnroll: (id: number) => void;
  onUnenroll: (id: number) => void;
}

export default function FormationCard({ 
  formation, 
  isEnrolled, 
  isLoggedIn, 
  onEnroll, 
  onUnenroll 
}: FormationCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleEnrollClick = () => {
    onEnroll(formation.id);
  };

  const handleUnenrollClick = () => {
    onUnenroll(formation.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      {formation.image ? (
        <div className="h-40 overflow-hidden">
          <img 
            src={formation.image} 
            alt={formation.title} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Image non disponible</span>
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold mb-2">{formation.title}</h2>
        
        <div className="mb-4 flex-grow">
          <p className="text-gray-600 mb-2 line-clamp-2">
            {formation.description}
          </p>
          
          {showDetails && (
            <div className="mt-4 space-y-2 text-sm">
              {formation.instructor && (
                <p className="text-gray-700">
                  <span className="font-medium">Instructeur:</span> {formation.instructor}
                </p>
              )}
              {formation.category && (
                <p className="text-gray-700">
                  <span className="font-medium">Catégorie:</span> {formation.category}
                </p>
              )}
              {formation.level && (
                <p className="text-gray-700">
                  <span className="font-medium">Niveau:</span> {formation.level}
                </p>
              )}
              {formation.rating !== undefined && (
                <p className="text-gray-700">
                  <span className="font-medium">Évaluation:</span> {formation.rating}/5
                </p>
              )}
              {formation.enrolled !== undefined && (
                <p className="text-gray-700">
                  <span className="font-medium">Inscriptions:</span> {formation.enrolled} étudiants
                </p>
              )}
            </div>
          )}
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
          >
            {showDetails ? 'Voir moins' : 'Voir plus'}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-500 text-sm">Durée: {formation.duration} heures</p>
          
          <div className="flex space-x-2">
            <Link 
              href={`/formations/${formation.id}`}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              Détails
            </Link>
            
            {isLoggedIn ? (
              isEnrolled ? (
                <button
                  onClick={handleUnenrollClick}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                >
                  Se désinscrire
                </button>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  S'inscrire
                </button>
              )
            ) : (
              <Link 
                href="/login"
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}