import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000';  // URL de votre backend FastAPI

  constructor(private http: HttpClient) {}

  // Exemple: Récupérer la liste des étudiants
  getStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/students`);
  }

  // Exemple: Authentification
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Ajoutez d'autres méthodes pour les formations, départements, etc.
}