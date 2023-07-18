import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PageErrorComponent } from './components/page-error/page-error.component';
import { FeaturesComponent } from './components/landing-page/features/features.component';
import { CoursesComponent } from './components/landing-page/courses/courses.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { NavbarComponent } from './components/main-menu/navbar/navbar.component';
import { FooterComponent } from './components/main-menu/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    PageErrorComponent,
    FeaturesComponent,
    CoursesComponent,
    LoginPageComponent,
    RegisterPageComponent,
    MainMenuComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
