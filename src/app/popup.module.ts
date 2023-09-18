import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ButtonComponent } from './components/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopupComponent } from './popup.component';

@NgModule({
  declarations: [PopupComponent, ButtonComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  bootstrap: [PopupComponent],
})
export class PopupModule {}
