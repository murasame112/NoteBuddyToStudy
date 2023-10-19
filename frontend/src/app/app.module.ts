import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {QuillModule} from 'ngx-quill';
import { FormsModule } from '@angular/forms';

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
import { NotesComponent } from './components/main-menu/functions/notes/notes.component';
import { NoteAddComponent } from './components/main-menu/functions/note-add/note-add.component';
import { CardAddComponent } from './components/main-menu/functions/card-add/card-add.component';
import { SearchForBuddyComponent } from './components/main-menu/functions/search-for-buddy/search-for-buddy.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotesContainerComponent } from './components/main-menu/functions/notes/notes-container/notes-container.component';
import { ShowNoteComponent } from './components/main-menu/functions/notes/show-note/show-note.component';




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
    FooterComponent,
    NotesComponent,
    NoteAddComponent,
    CardAddComponent,
    SearchForBuddyComponent,
    NotesContainerComponent,
    ShowNoteComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    QuillModule.forRoot(),
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
