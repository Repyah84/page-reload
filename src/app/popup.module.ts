import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupComponent } from './popup.component';

@NgModule({
  declarations: [PopupComponent],
  imports: [BrowserModule, ReactiveFormsModule, FormsModule],
  bootstrap: [PopupComponent],
})
export class PopupModule {}
