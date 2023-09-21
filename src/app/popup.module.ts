import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupComponent } from './popup.component';
import { IntervalPresetComponent } from './components/interval-preset/interval-preset.component';
import { SelectRandomInterval } from './components/select-rundom-interval/select-random-interval.component';

@NgModule({
  declarations: [PopupComponent, IntervalPresetComponent, SelectRandomInterval],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [PopupComponent],
})
export class PopupModule {}
