import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderMaintenanceComponent } from './under-maintenance.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  { path: '', component: UnderMaintenanceComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
  ],
  declarations: [UnderMaintenanceComponent]
})
export class UnderMaintenanceModule { }
