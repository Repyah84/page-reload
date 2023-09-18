import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { PopupModule } from './app/popup.module';

platformBrowserDynamic()
  .bootstrapModule(PopupModule)
  .catch((err) => console.error(err));
