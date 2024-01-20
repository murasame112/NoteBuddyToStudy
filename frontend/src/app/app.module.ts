import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuillModule } from 'ngx-quill';
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
import { CardAddComponent } from './components/main-menu/functions/cards/card-add/card-add.component';
import { SearchForBuddyComponent } from './components/main-menu/functions/search-for-buddy/search-for-buddy.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotesModelComponent } from './components/main-menu/functions/notes/notes-model/notes-model.component';
import { ShowNoteComponent } from './components/main-menu/functions/notes/show-note/show-note.component';
import { AdminPanelMainComponent } from './components/main-menu/functions/admin-panel/admin-panel-main/admin-panel-main.component';
import { AdminFindUserNotesComponent } from './components/main-menu/functions/admin-panel/admin-find-user-notes/admin-find-user-notes.component';
import { AdminCrudCatSubcatComponent } from './components/main-menu/functions/admin-panel/admin-crud-cat-subcat/admin-crud-cat-subcat.component';
import { AdminCrudHintsComponent } from './components/main-menu/functions/admin-panel/admin-crud-hints/admin-crud-hints.component';
import { HintsComponent } from './components/main-menu/functions/hints/hints.component';
import { HintModelComponent } from './components/main-menu/functions/hints/hint-model/hint-model.component';
import { CardsComponent } from './components/main-menu/functions/cards/cards.component';
import { CardModelComponent } from './components/main-menu/functions/cards/card-model/card-model.component';
import { CardMyCardsModelComponent } from './components/main-menu/functions/cards/card-my-cards-model/card-my-cards-model.component';
import { AuthInterceptor } from './services/interceptors/auth.interceptor';
import { SettingsPageComponent } from './components/main-menu/functions/settings-page/settings-page.component';
import { FavoriteNotesComponent } from './components/main-menu/functions/favorite-notes/favorite-notes.component';
import { MyNotesComponent } from './components/main-menu/functions/my-notes/my-notes.component';
import { EditNoteComponent } from './components/main-menu/functions/edit-note/edit-note.component';
import { GroupsComponent } from './components/main-menu/functions/chat/groups/groups.component';
import { ChatComponent } from './components/main-menu/functions/chat/chat/chat.component';
import { GroupModelComponent } from './components/main-menu/functions/chat/groups/group-model/group-model.component';
import { MessageModelComponent } from './components/main-menu/functions/chat/chat/message-model/message-model.component';

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
    NotesModelComponent,
    ShowNoteComponent,
    AdminPanelMainComponent,
    AdminFindUserNotesComponent,
    AdminCrudCatSubcatComponent,
    AdminCrudHintsComponent,
    HintsComponent,
    HintModelComponent,
    CardsComponent,
    CardModelComponent,
    CardMyCardsModelComponent,
    SettingsPageComponent,
    FavoriteNotesComponent,
    MyNotesComponent,
    EditNoteComponent,
    GroupsComponent,
    ChatComponent,
    GroupModelComponent,
    MessageModelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    QuillModule.forRoot(),
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
