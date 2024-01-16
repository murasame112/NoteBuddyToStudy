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
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';
import { roleGuard } from './guards/role.guard';
import { showreglogGuard } from './guards/showreglog.guard';
import { FavoriteNotesComponent } from './components/main-menu/functions/favorite-notes/favorite-notes.component';
import { MyNotesComponent } from './components/main-menu/functions/my-notes/my-notes.component';
import { EditNoteComponent } from './components/main-menu/functions/edit-note/edit-note.component';
import { ChatApiTestComponent } from './components/main-menu/functions/chat-api-test/chat-api-test.component';
import { GroupsComponent } from './components/main-menu/functions/chat/groups/groups.component';
import { ChatComponent } from './components/main-menu/functions/chat/chat/chat.component';
import { chatGuard } from './guards/chat.guard';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [showreglogGuard],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [showreglogGuard],
  },
  { path: 'main', component: MainMenuComponent },
  {
    path: 'notes',
    component: NotesComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'note/:id',
    component: ShowNoteComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'note-add',
    component: NoteAddComponent,
    canActivate: [isAuthenticatedGuard],
  },

  {
    path: 'editNote/:id',
    component: EditNoteComponent,
    canActivate: [isAuthenticatedGuard],
  },

  {
    path: 'card-add/:id',
    component: CardAddComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'cards/:id',
    component: CardsComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'search-for-buddy',
    component: SearchForBuddyComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'admin-panel',
    component: AdminPanelMainComponent,
    canActivate: [isAuthenticatedGuard, roleGuard],
  },
  {
    path: 'hints',
    component: HintsComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [isAuthenticatedGuard],
  },

  {
    path: 'favorite',
    component: FavoriteNotesComponent,
    canActivate: [isAuthenticatedGuard],
  },

  {
    path: 'mynotes',
    component: MyNotesComponent,
    canActivate: [isAuthenticatedGuard],
  },

  {
    path: 'groups',
    component: GroupsComponent,
    canActivate: [isAuthenticatedGuard],
  },

  {
    path: 'chattest',
    component: ChatApiTestComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'chat/:id',
    component: ChatComponent,
    canActivate: [isAuthenticatedGuard, chatGuard],
  },

  { path: '**', component: PageErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
