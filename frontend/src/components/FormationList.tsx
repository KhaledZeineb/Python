// components/FormationList.tsx
"use client";

import { useState, useEffect } from 'react';
import FormationCard from './FormationCard';

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

interface FormationListProps {
  formations: Formation[];
  enrolledFormations: number[];
  isLoggedIn: boolean;
  onEnroll: (id: number) => void;
  onUnenroll: (id: number) => void;
}

export default function FormationList({ 
  formations, 
  enrolledFormations, 
  isLoggedIn, 
  onEnroll, 
  onUnenroll 
}: FormationListProps) {
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>(formations);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Extract unique categories and levels from formations
  const categories = ['all', ...Array.from(new Set(formations.filter(f => f.category).map(f => f.category as string)))];
  const levels = ['all', ...Array.from(new Set(formations.filter(f => f.level).map(f => f.level as string)))];

  useEffect(() => {
    let result = [...formations];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(formation => 
        formation.title.toLowerCase().includes(term) || 
        formation.description.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(formation => formation.category === categoryFilter);
    }

    // Apply level filter
    if (levelFilter !== 'all') {
      result = result.filter(formation => formation.level === levelFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        result.sort((a, b) => a.duration - b.duration);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'enrolled':
        result.sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredFormations(result);
  }, [formations, searchTerm, categoryFilter, levelFilter, sortBy]);

  const handleEnroll = (id: number) => {
    onEnroll(id);
  };

  const handleUnenroll = (id: number) => {
    onUnenroll(id);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevelFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setLevelFilter('all');
    setSortBy('default');
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtres et recherche</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Rechercher une formation..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category === 'all' ? 'Toutes les catégories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Niveau
            </label>
            <select
              id="level"
              value={levelFilter}
              onChange={handleLevelChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {levels.map((level, index) => (
                <option key={index} value={level}>
                  {level === 'all' ? 'Tous les niveaux' : level}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Par défaut</option>
              <option value="title">Titre (A-Z)</option>
              <option value="duration">Durée (croissant)</option>
              <option value="rating">Évaluation (décroissant)</option>
              <option value="enrolled">Popularité</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            Réinitialiser les filtres
          </button>
          
          <p className="text-sm text-gray-500">
            {filteredFormations.length} formation{filteredFormations.length !== 1 ? 's' : ''} trouvée{filteredFormations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      {filteredFormations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Aucune formation ne correspond à vos critères de recherche.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredFormations.map((formation) => (
            <FormationCard
              key={formation.id}
              formation={formation}
              isEnrolled={enrolledFormations.includes(formation.id)}
              isLoggedIn={isLoggedIn}
              onEnroll={handleEnroll}
              onUnenroll={handleUnenroll}
            />
          ))}
        </div>
      )}
    </div>
  );
}