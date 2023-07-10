import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PageErrorComponent } from './components/page-error/page-error.component';
import { FeaturesComponent } from './components/landing-page/features/features.component';
import { CoursesComponent } from './components/landing-page/courses/courses.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    PageErrorComponent,
    FeaturesComponent,
    CoursesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
