import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryDashboardComponent } from './inventory-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes:Routes = [
  {path:'',component:InventoryDashboardComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    InfiniteScrollModule
  ],
  declarations: [InventoryDashboardComponent]
})
export class InventoryDashboardModule { }
