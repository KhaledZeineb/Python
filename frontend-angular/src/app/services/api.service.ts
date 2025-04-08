import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000'; // Ajustez le port selon votre configuration FastAPI

  constructor(private http: HttpClient) { }

  // Méthodes pour les départements
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departments`);
  }

  getDepartment(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/departments/${id}`);
  }

  createDepartment(department: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/departments`, department);
  }

  // Méthodes pour les formations
  getFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/formations`);
  }

  getFormation(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/formations/${id}`);
  }

  createFormation(formation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formations`, formation);
  }

  // Méthodes pour les étudiants
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students`);
  }

  getStudent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${id}`);
  }

  createStudent(student: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/students`, student);
  }

  updateStudent(id: number, student: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/students/${id}`, student);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/students/${id}`);
  }

  // Méthodes pour les inscriptions
  enrollStudent(studentId: number, formationId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/students/${studentId}/enroll/${formationId}`, {});
  }

  unenrollStudent(studentId: number, formationId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/students/${studentId}/unenroll/${formationId}`);
  }

  getStudentFormations(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${studentId}/formations`);
  }

  // Méthode pour l'authentification
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
}