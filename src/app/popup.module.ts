import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { PopupComponent } from './popup.component';
@NgModule({
  declarations: [PopupComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  bootstrap: [PopupComponent],
})
export class PopupModule {}
