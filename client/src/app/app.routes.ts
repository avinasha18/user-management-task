// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

export const routes: Routes = [
  { path: 'users', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit', component: EditProfileComponent },
  { path: '**', redirectTo: '/login' }
];
