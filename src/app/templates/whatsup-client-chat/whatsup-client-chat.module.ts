import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsupClientChatComponent } from './whatsup-client-chat.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';

const routes : Routes = [
  {path : '' , component : WhatsupClientChatComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    DropdownModule,
    ProgressBarModule
  ],
  declarations: [WhatsupClientChatComponent]
})
export class WhatsupClientChatModule { }
