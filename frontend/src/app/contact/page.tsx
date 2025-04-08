// app/contact/page.tsx
"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null as string | null }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
    
    try {
      // Simuler un envoi à une API - à remplacer par votre endpoint réel
      // await axios.post('http://localhost:8000/contact', formData);
      
      // Simulation de délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: 'Merci pour votre message. Nous vous répondrons dès que possible.' }
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: 'Une erreur est survenue. Veuillez réessayer plus tard.' }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Nos informations</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Adresse</h3>
              <p className="text-gray-600">123 Rue de la Formation<br />75001 Paris, France</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Téléphone</h3>
              <p className="text-gray-600">+33 (0)1 23 45 67 89</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Email</h3>
              <p className="text-gray-600">contact@formationenligne.fr</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700">Horaires</h3>
              <p className="text-gray-600">Du lundi au vendredi<br />9h00 - 18h00</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Suivez-nous</h2>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full hover:bg-blue-700">
                F
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 text-white flex items-center justify-center rounded-full hover:bg-blue-500">
                T
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 text-white flex items-center justify-center rounded-full hover:bg-pink-700">
                I
              </a>
              <a href="#" className="w-10 h-10 bg-blue-800 text-white flex items-center justify-center rounded-full hover:bg-blue-900">
                L
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Envoyez-nous un message</h2>
          
          {status.info.msg && (
            <div className={`p-4 rounded mb-6 ${status.info.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {status.info.msg}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom complet</label>
              <input 
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre nom"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="votre@email.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Sujet</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="information">Demande d'information</option>
                <option value="support">Support technique</option>
                <option value="billing">Facturation</option>
                <option value="partnership">Partenariat</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="Votre message..."
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={status.submitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {status.submitting ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Notre localisation</h2>
        <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          {/* Remplacer par une vraie carte ou une iframe Google Maps */}
          <p className="text-gray-500">Carte interactive à intégrer ici</p>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Comment puis-je m'inscrire à une formation ?</h3>
            <p className="text-gray-600">Pour vous inscrire à une formation, vous devez d'abord créer un compte, puis naviguer vers la page des formations et cliquer sur le bouton "S'inscrire" à côté de la formation qui vous intéresse.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Comment puis-je obtenir une attestation de formation ?</h3>
            <p className="text-gray-600">Les attestations de formation sont disponibles automatiquement dans votre espace personnel une fois que vous avez complété tous les modules d'une formation et réussi l'évaluation finale.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Proposez-vous des formations personnalisées pour les entreprises ?</h3>
            <p className="text-gray-600">Oui, nous proposons des solutions de formation sur mesure pour les entreprises. Contactez notre équipe commerciale pour discuter de vos besoins spécifiques.</p>
          </div>
        </div>
      </div>
    </div>
  );
}