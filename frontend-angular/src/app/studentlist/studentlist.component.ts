import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-studentlist',
  standalone: true,
  templateUrl: './studentlist.component.html',
  styleUrls: ['./studentlist.component.css'],
  imports: [CommonModule]
})
export class StudentlistComponent implements OnInit {

  students: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8000/students').subscribe({
      next: (res) => {
        this.students = res.students;
        console.log(this.students); 
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      }
    });
  }
}