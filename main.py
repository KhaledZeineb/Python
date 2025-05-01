from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
import jwt
from datetime import datetime, timedelta
import secrets

# Configuration de la base de données PostgreSQL
DATABASE_URL = "postgresql://postgres:123456789@localhost/gestion_etudiants"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Configuration JWT
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Table d'association entre étudiant et formation
student_formation = Table(
    "student_formation",
    Base.metadata,
    Column("student_id", Integer, ForeignKey("students.id")),
    Column("formation_id", Integer, ForeignKey("formations.id")),
)

# Modèles SQLAlchemy
class DepartmentModel(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    
    students = relationship("StudentModel", back_populates="department")

class FormationModel(Base):
    __tablename__ = "formations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    duration = Column(Integer)  # Durée en heures
    
    students = relationship("StudentModel", secondary=student_formation, back_populates="formations")

class StudentModel(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    major = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="user")  # 'user' ou 'admin'
    
    department_id = Column(Integer, ForeignKey("departments.id"))
    department = relationship("DepartmentModel", back_populates="students")
    formations = relationship("FormationModel", secondary=student_formation, back_populates="students")

# Créer les tables dans la base de données
Base.metadata.create_all(bind=engine)

# Modèles Pydantic pour la validation des données
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: int
    
    class Config:
        orm_mode = True

class FormationBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration: int

class FormationCreate(FormationBase):
    pass

class Formation(FormationBase):
    id: int
    
    class Config:
        orm_mode = True

class StudentBase(BaseModel):
    name: str
    age: int
    major: Optional[str] = None
    email: str
    password: Optional[str] = None

class StudentCreate(StudentBase):
    department_id: int

class Student(StudentBase):
    id: int
    department_id: int
    role: str
    
    class Config:
        orm_mode = True

class StudentResponse(BaseModel):
    id: int
    name: str
    age: int
    major: Optional[str] = None
    email: str
    department_id: int
    role: str
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Fonctions utilitaires
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = db.query(StudentModel).filter(StudentModel.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(
    current_user: StudentModel = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

# Initialisation de l'application FastAPI
app = FastAPI(title="API de Gestion des Étudiants")

# Configuration de CORS pour permettre les requêtes du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4200"],  # NextJS et Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes publiques
@app.post("/login", response_model=Token)
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(StudentModel).filter(StudentModel.email == email).first()
    if not user or user.password != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=StudentResponse)
async def read_users_me(current_user: StudentModel = Depends(get_current_user)):
    return current_user

# Routes pour les départements (publiques)
@app.get("/departments", response_model=List[Department])
def get_departments(db: Session = Depends(get_db)):
    return db.query(DepartmentModel).all()

@app.get("/departments/{department_id}", response_model=Department)
def get_department(department_id: int, db: Session = Depends(get_db)):
    db_department = db.query(DepartmentModel).filter(DepartmentModel.id == department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Département non trouvé")
    return db_department

# Routes protégées (admin seulement)
@app.post("/departments", response_model=Department)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: StudentModel = Depends(get_current_admin)
):
    db_department = DepartmentModel(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

# Routes pour les formations
@app.get("/formations", response_model=List[Formation])
def get_formations(db: Session = Depends(get_db)):
    return db.query(FormationModel).all()

@app.post("/formations", response_model=Formation)
def create_formation(
    formation: FormationCreate,
    db: Session = Depends(get_db),
    current_user: StudentModel = Depends(get_current_admin)
):
    db_formation = FormationModel(**formation.dict())
    db.add(db_formation)
    db.commit()
    db.refresh(db_formation)
    return db_formation

# Routes pour les étudiants
@app.post("/students", response_model=StudentResponse)
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    current_user: StudentModel = Depends(get_current_admin)
):
    db_department = db.query(DepartmentModel).filter(DepartmentModel.id == student.department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Département non trouvé")
    
    db_student = StudentModel(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.get("/students", response_model=List[StudentResponse])
def get_students(
    db: Session = Depends(get_db),
    current_user: StudentModel = Depends(get_current_admin)
):
    return db.query(StudentModel).all()

# Routes admin spéciales
@app.get("/admin/students", response_model=List[StudentResponse])
def get_all_students_admin(
    db: Session = Depends(get_db),
    current_user: StudentModel = Depends(get_current_admin)
):
    return db.query(StudentModel).all()

# Route racine pour tester l'API
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de gestion des étudiants"}