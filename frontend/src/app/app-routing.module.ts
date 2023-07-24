import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PageErrorComponent } from './components/page-error/page-error.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { NotesComponent } from './components/main-menu/functions/notes/notes.component';
import { NoteAddComponent } from './components/main-menu/functions/note-add/note-add.component';

const routes: Routes = [
  {path:'', redirectTo:"landing", pathMatch:"full"},
  {path:'landing', component:LandingPageComponent},
  {path:'login', component:LoginPageComponent},
  {path:'register', component:RegisterPageComponent},
  {path:'main', component:MainMenuComponent},
  {path:'notes', component:NotesComponent},
  {path:'note-add', component:NoteAddComponent},
  {path:'**', component:PageErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
