import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentlistComponent } from './studentlist/studentlist.component';
import { AddCourseComponent } from './add-course/add-course.component';

const routes: Routes = [
  {path:"students" , component:StudentlistComponent},
  {path:"courses" , component:AddCourseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }