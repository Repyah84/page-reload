import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupComponent } from './popup.component';
import { IntervalPresetComponent } from './components/interval-preset/interval-preset.component';

@NgModule({
  declarations: [PopupComponent, IntervalPresetComponent],
  imports: [BrowserModule, ReactiveFormsModule, FormsModule],
  bootstrap: [PopupComponent],
})
export class PopupModule {}
