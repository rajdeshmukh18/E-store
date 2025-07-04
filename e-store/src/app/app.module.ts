import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BnNgIdleModule } from 'bn-ng-idle';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [BnNgIdleModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
