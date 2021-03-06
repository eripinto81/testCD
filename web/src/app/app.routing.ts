import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

const routes: Routes= [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, 
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
  }, 
  {
    path: '',
    component: AdminLayoutComponent,
    loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: []
})
export class AppRoutingModule { }
