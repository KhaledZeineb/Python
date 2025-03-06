# Gestion des Étudiants

Ce projet est une application web pour la gestion des étudiants, construite avec FastAPI pour le backend et Next.js pour le frontend.

## Prérequis

- Python 3.11 ou supérieur
- Node.js 14 ou supérieur
- npm ou yarn

## Installation

### Backend (FastAPI)

1. Clonez le dépôt :
    ```sh
    git clone https://github.com/votre-utilisateur/votre-repo.git
    cd votre-repo
    ```

2. Créez et activez un environnement virtuel :
    ```sh
    python -m venv env
    source env/bin/activate  # Sur Windows, utilisez `env\Scripts\activate`
    ```

3. Installez les dépendances :
    ```sh
    pip install fastapi uvicorn pydantic
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
    ```

3. Démarrez le serveur de développement Next.js :
    ```sh
    npm run dev
    ```

Le serveur frontend sera disponible à l'adresse `http://localhost:3000`.

## Utilisation

- Accédez à `http://localhost:3000` dans votre navigateur pour voir la liste des étudiants.
- Utilisez le formulaire pour ajouter, modifier ou supprimer des étudiants.

## Structure du Projet
main.py frontend/ ├── .gitignore ├── next-env.d.ts ├── next.config.ts ├── package.json ├── postcss.config.mjs ├── README.md ├── tsconfig.json ├── public/ └── src/ └── app/ └── page.tsx


## Routes API

- `GET /students` : Récupérer la liste des étudiants
- `GET /students/{student_id}` : Récupérer un étudiant par ID
- `POST /students` : Ajouter un nouvel étudiant
- `PUT /students/{student_id}` : Mettre à jour un étudiant existant
- `DELETE /students/{student_id}` : Supprimer un étudiant

## Configuration CORS

Assurez-vous que la configuration CORS dans `main.py` permet les requêtes provenant de votre frontend :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Contribuer
Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour discuter des changements que vous souhaitez apporter.

Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.


N'oubliez pas de remplacer `votre-utilisateur` et `votre-repo` par votre nom d'utilisateur GitHub et le nom de votre dépôt.
