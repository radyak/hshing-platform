import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { OverviewComponent } from './overview/overview.component';
import { StoreComponent } from './store/store.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogoComponent } from './logo/logo.component';
import { BackendCardComponent } from './backend-card/backend-card.component';
import { BackendDetailsComponent } from './backend-details/backend-details.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    StoreComponent,
    NavbarComponent,
    LogoComponent,
    BackendCardComponent,
    BackendDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
