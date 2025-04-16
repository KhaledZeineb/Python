// app/about/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">À propos de nous</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">Notre mission</h2>
        <p className="text-gray-700 mb-4">
          Notre plateforme de formation en ligne a été créée avec une mission claire : rendre l'éducation de qualité accessible à tous. 
          Nous croyons que chaque personne mérite d'avoir accès à des opportunités d'apprentissage qui peuvent transformer sa vie 
          et sa carrière.
        </p>
        <p className="text-gray-700 mb-4">
          En proposant des formations diverses et adaptées aux besoins du marché actuel, nous aidons nos étudiants à acquérir 
          les compétences nécessaires pour réussir dans un monde professionnel en constante évolution.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">Notre histoire</h2>
        <p className="text-gray-700 mb-4">
          Fondée en 2022, notre plateforme est née de la conviction que l'apprentissage ne devrait pas être limité par des contraintes 
          géographiques ou financières. Ce qui a commencé comme une petite startup avec quelques cours en ligne s'est rapidement 
          développé en une communauté d'apprentissage dynamique.
        </p>
        <p className="text-gray-700 mb-4">
          Aujourd'hui, nous sommes fiers de proposer plus de 100 formations différentes, enseignées par des experts de l'industrie, 
          et suivies par des milliers d'étudiants à travers le monde.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">Notre équipe</h2>
        <p className="text-gray-700 mb-4">
          Notre équipe est composée de professionnels passionnés par l'éducation et la technologie. Des enseignants expérimentés 
          aux développeurs talentueux, chaque membre apporte une expertise unique qui contribue à la qualité de notre plateforme.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <h3 className="font-semibold text-gray-900">Jean Dupont</h3>
            <p className="text-gray-600 text-sm">Fondateur & PDG</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <h3 className="font-semibold text-gray-900">Marie Lambert</h3>
            <p className="text-gray-600 text-sm">Directrice Pédagogique</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <h3 className="font-semibold text-gray-900">Thomas Martin</h3>
            <p className="text-gray-600 text-sm">Responsable Technique</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-700 mb-4">Vous souhaitez en savoir plus ou rejoindre notre équipe ?</p>
        <Link href="/contact" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Contactez-nous
        </Link>
      </div>
    </div>
  );
}