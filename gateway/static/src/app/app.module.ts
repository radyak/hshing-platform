import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { OverviewComponent } from './views/overview/overview.component';
import { StoreComponent } from './views/store/store.component';
import { BackendDetailsComponent } from './views/backend-details/backend-details.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LogoComponent } from './components/logo/logo.component';
import { BackendCardComponent } from './components/backend-card/backend-card.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { BackendsService } from './services/backends.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    StoreComponent,
    NavbarComponent,
    LogoComponent,
    BackendCardComponent,
    BackendDetailsComponent,
    LoadingBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFontAwesomeModule,
    HttpClientModule
  ],
  providers: [
    BackendsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
