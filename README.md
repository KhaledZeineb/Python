# Gestion des Étudiants

Une application web complète pour la gestion des étudiants, construite avec FastAPI (backend) et Next.js (frontend).

## 📋 Prérequis

- Python 3.11 ou supérieur
- Node.js 14 ou supérieur
- npm ou yarn

## 🚀 Installation

### Backend (FastAPI)

1. Clonez le dépôt :
   ```sh
   git clone https://github.com/KhaledZeineb/Python.git
   cd votre-repo
   ```

2. Créez et activez un environnement virtuel :
   ```sh
   python -m venv env
   source env/bin/activate  # Sur Windows, utilisez `env\Scripts\activate`
   ```

3. Installez les dépendances :
   ```sh
   pip install -r requirements.txt
   ```
   
   Si le fichier `requirements.txt` n'existe pas, installez les packages essentiels :
   ```sh
   pip install fastapi uvicorn pydantic sqlalchemy
   ```

4. Démarrez le serveur FastAPI :
   ```sh
   uvicorn main:app --reload
   ```
   
   Le serveur backend sera disponible à l'adresse `http://127.0.0.1:8000`.

### Frontend (Next.js)

1. Accédez au répertoire `frontend` :
   ```sh
   cd frontend
   ```

2. Installez les dépendances :
   ```sh
   npm install
   # ou
   yarn install
   ```

3. Démarrez le serveur de développement Next.js :
   ```sh
   npm run dev
   # ou
   yarn dev
   ```
   
   Le serveur frontend sera disponible à l'adresse `http://localhost:3000`.

## 🖥️ Utilisation

- Accédez à `http://localhost:3000` dans votre navigateur pour interagir avec l'application
- Utilisez l'interface pour:
  - Consulter la liste des étudiants
  - Ajouter de nouveaux étudiants
  - Modifier les informations existantes
  - Supprimer des étudiants

## 📁 Structure du Projet

```
/
├── main.py                 # Point d'entrée de l'API FastAPI
├── models/                 # Modèles de données
├── routers/                # Routes de l'API
├── database.py             # Configuration de la base de données
├── requirements.txt        # Dépendances Python
│
└── frontend/               # Application Next.js
    ├── .gitignore
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── public/             # Fichiers statiques
    └── src/                # Code source
        └── app/
            ├── components/ # Composants React
            ├── lib/        # Fonctions utilitaires
            └── page.tsx    # Page principale
```

## 🔄 Routes API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/students` | Récupérer la liste des étudiants |
| GET | `/students/{student_id}` | Récupérer un étudiant par ID |
| POST | `/students` | Ajouter un nouvel étudiant |
| PUT | `/students/{student_id}` | Mettre à jour un étudiant existant |
| DELETE | `/students/{student_id}` | Supprimer un étudiant |

## ⚙️ Configuration CORS

Assurez-vous que la configuration CORS dans `main.py` permet les requêtes provenant de votre frontend :

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔧 Configuration de la Base de Données

L'application utilise SQLAlchemy pour la gestion de la base de données. Configurez votre connexion dans `database.py` :

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./students.db"  # SQLite pour le développement
# Pour la production, utilisez PostgreSQL ou MySQL
# DATABASE_URL = "postgresql://user:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📮 Contact

Pour toute question, n'hésitez pas à ouvrir une issue ou à contacter [khaledzeineb81@gmail.com].
