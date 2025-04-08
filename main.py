from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session

# Configuration de la base de données PostgreSQL
DATABASE_URL = "postgresql://postgres:123456789@localhost/gestion_etudiants"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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
    
    class Config:
        orm_mode = True

class StudentResponse(BaseModel):
    id: int
    name: str
    age: int
    major: Optional[str] = None
    email: str
    department_id: int
    
    class Config:
        orm_mode = True

# Fonctions utilitaires
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

# Routes pour les départements
@app.post("/departments", response_model=Department)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    db_department = DepartmentModel(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@app.get("/departments", response_model=List[Department])
def get_departments(db: Session = Depends(get_db)):
    return db.query(DepartmentModel).all()

@app.get("/departments/{department_id}", response_model=Department)
def get_department(department_id: int, db: Session = Depends(get_db)):
    db_department = db.query(DepartmentModel).filter(DepartmentModel.id == department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Département non trouvé")
    return db_department

# Routes pour les formations
@app.post("/formations", response_model=Formation)
def create_formation(formation: FormationCreate, db: Session = Depends(get_db)):
    db_formation = FormationModel(**formation.dict())
    db.add(db_formation)
    db.commit()
    db.refresh(db_formation)
    return db_formation

@app.get("/formations", response_model=List[Formation])
def get_formations(db: Session = Depends(get_db)):
    return db.query(FormationModel).all()

@app.get("/formations/{formation_id}", response_model=Formation)
def get_formation(formation_id: int, db: Session = Depends(get_db)):
    db_formation = db.query(FormationModel).filter(FormationModel.id == formation_id).first()
    if db_formation is None:
        raise HTTPException(status_code=404, detail="Formation non trouvée")
    return db_formation

# Routes pour les étudiants
@app.post("/students", response_model=StudentResponse)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    # Vérifier si le département existe
    db_department = db.query(DepartmentModel).filter(DepartmentModel.id == student.department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Département non trouvé")
    
    db_student = StudentModel(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.get("/students", response_model=List[StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return db.query(StudentModel).all()

@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    return db_student

@app.put("/students/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    # Vérifier si le département existe
    db_department = db.query(DepartmentModel).filter(DepartmentModel.id == student.department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Département non trouvé")
    
    # Mettre à jour l'étudiant
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    db.delete(db_student)
    db.commit()
    return {"message": f"Étudiant avec l'ID {student_id} supprimé"}

# Routes pour les inscriptions aux formations
@app.post("/students/{student_id}/enroll/{formation_id}")
def enroll_student(student_id: int, formation_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    db_formation = db.query(FormationModel).filter(FormationModel.id == formation_id).first()
    if db_formation is None:
        raise HTTPException(status_code=404, detail="Formation non trouvée")
    
    # Vérifier si l'étudiant est déjà inscrit à cette formation
    if db_formation in db_student.formations:
        raise HTTPException(status_code=400, detail="Étudiant déjà inscrit à cette formation")
    
    # Inscrire l'étudiant à la formation
    db_student.formations.append(db_formation)
    db.commit()
    return {"message": f"Étudiant {student_id} inscrit à la formation {formation_id}"}

@app.delete("/students/{student_id}/unenroll/{formation_id}")
def unenroll_student(student_id: int, formation_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    db_formation = db.query(FormationModel).filter(FormationModel.id == formation_id).first()
    if db_formation is None:
        raise HTTPException(status_code=404, detail="Formation non trouvée")
    
    # Vérifier si l'étudiant est inscrit à cette formation
    if db_formation not in db_student.formations:
        raise HTTPException(status_code=400, detail="Étudiant non inscrit à cette formation")
    
    # Désinscrire l'étudiant de la formation
    db_student.formations.remove(db_formation)
    db.commit()
    return {"message": f"Étudiant {student_id} désinscrit de la formation {formation_id}"}

@app.get("/students/{student_id}/formations", response_model=List[Formation])
def get_student_formations(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    return db_student.formations

# Route pour l'authentification des étudiants
@app.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.email == email).first()
    if db_student is None or db_student.password != password:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    return {"id": db_student.id, "name": db_student.name, "email": db_student.email}

# Route racine pour tester l'API
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de gestion des étudiants"}