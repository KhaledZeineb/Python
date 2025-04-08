// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">GestudiApp</h3>
            <p className="text-gray-300">Votre plateforme de gestion étudiante</p>
          </div>
          
          <div className="mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Liens rapides</h4>
            <ul>
              <li className="mb-1">
                <Link href="/" className="text-gray-300 hover:text-white">Accueil</Link>
              </li>
              <li className="mb-1">
                <Link href="/formations" className="text-gray-300 hover:text-white">Formations</Link>
              </li>
              <li className="mb-1">
                <Link href="/about" className="text-gray-300 hover:text-white">À propos</Link>
              </li>
              <li className="mb-1">
                <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact</h4>
            <p className="text-gray-300 mb-1">Email: contact@gestudiapp.fr</p>
            <p className="text-gray-300 mb-1">Téléphone: +33 1 23 45 67 89</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-300">© {currentYear} GestudiApp. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}