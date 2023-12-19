import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PageErrorComponent } from './components/page-error/page-error.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { NotesComponent } from './components/main-menu/functions/notes/notes.component';
import { NoteAddComponent } from './components/main-menu/functions/note-add/note-add.component';
import { CardAddComponent } from './components/main-menu/functions/cards/card-add/card-add.component';
import { SearchForBuddyComponent } from './components/main-menu/functions/search-for-buddy/search-for-buddy.component';
import { ShowNoteComponent } from './components/main-menu/functions/notes/show-note/show-note.component';
import { AdminPanelMainComponent } from './components/main-menu/functions/admin-panel/admin-panel-main/admin-panel-main.component';
import { HintsComponent } from './components/main-menu/functions/hints/hints.component';
import { CardsComponent } from './components/main-menu/functions/cards/cards.component';
import { SettingsPageComponent } from './components/main-menu/functions/settings-page/settings-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'main', component: MainMenuComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'note/:id', component: ShowNoteComponent },
  { path: 'note-add', component: NoteAddComponent },
  { path: 'card-add/:id', component: CardAddComponent },
  { path: 'cards/:id', component: CardsComponent },
  { path: 'search-for-buddy', component: SearchForBuddyComponent },
  { path: 'admin-panel', component: AdminPanelMainComponent },
  { path: 'hints', component: HintsComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', component: PageErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
