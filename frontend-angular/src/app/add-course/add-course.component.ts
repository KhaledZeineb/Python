import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-course',
  standalone: true,
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class AddCourseComponent {
  course = {
    course_name: '',
    course_field: '',
    course_duration: '',
    course_price: ''  
  };

 
  formErrors = {
    course_name: '',
    course_field: '',
    course_duration: '',
    course_price: ''
  };

  
  isSubmitting = false;
  submissionSuccess = false;
  submissionError = '';

  constructor(private http: HttpClient) {}

  validateForm(): boolean {
    let isValid = true;
    
    
    this.formErrors = {
      course_name: '',
      course_field: '',
      course_duration: '',
      course_price: ''
    };

    
    if (!this.course.course_name) {
      this.formErrors.course_name = 'Course name is required';
      isValid = false;
    }

    if (!this.course.course_field) {
      this.formErrors.course_field = 'Course field is required';
      isValid = false;
    }

    if (!this.course.course_duration) {
      this.formErrors.course_duration = 'Course duration is required';
      isValid = false;
    }

    if (!this.course.course_price) {
      this.formErrors.course_price = 'Course price is required';
      isValid = false;
    }
    return isValid;
  }

  addCourse() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.submissionSuccess = false;
    this.submissionError = '';

   
    const courseData = {
      ...this.course,
      course_price: this.course.course_price.toString()
    };

    this.http.post('http://127.0.0.1:8000/addcourse', courseData)
      .subscribe({
        next: (response) => {
          console.log('Course added successfully', response);
          this.isSubmitting = false;
          this.submissionSuccess = true;
          
          this.course = {
            course_name: '',
            course_field: '',
            course_duration: '',
            course_price: ''
          };
          
          setTimeout(() => this.submissionSuccess = false, 3000);
        },
        error: (error) => {
          console.error('Error adding course', error);
          this.isSubmitting = false;
          this.submissionError = 'Failed to add course. Please try again.';
          
          if (error.error?.detail) {
            this.submissionError = error.error.detail;
          }
        }
      });
  }
}