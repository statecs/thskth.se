import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Routes import
import { routing } from './app.routes';

// Services
import { WordpressApiService } from './services/wordpress/wordpress-api.service';
import { APP_CONFIG, appConfig } from './app.config';
import { CookieModule } from 'ngx-cookie';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AboutThsComponent } from './components/about-ths/about-ths.component';
import { NavbarPrimaryComponent } from './components/header/navbar-primary/navbar-primary.component';
import { NavbarSecondaryComponent } from './components/header/navbar-secondary/navbar-secondary.component';
import { NavbarSectionsComponent } from './components/header/navbar-sections/navbar-sections.component';
import { NavbarFooterComponent } from './components/footer/navbar-footer/navbar-footer.component';
import { CardCategorizerComponent } from './components/card-categorizer/card-categorizer.component';
import { CardsContainerComponent } from './components/cards-container/cards-container.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    AboutThsComponent,
    NavbarPrimaryComponent,
    NavbarSecondaryComponent,
    NavbarSectionsComponent,
    NavbarFooterComponent,
    CardCategorizerComponent,
    CardsContainerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    CookieModule.forRoot()
  ],
  providers: [
      WordpressApiService,
      {provide: APP_CONFIG, useValue: appConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
