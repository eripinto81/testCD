import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Guard implements CanActivate {

  private usuario= null;

  private currentUser= JSON.parse(localStorage.getItem('currentUser'));
  
  constructor(private router: Router, private http: HttpClient, private toastr: ToastrManager) {
    // if(!navigator.onLine){
    //   this.toastr.errorToastr("Você está sem internet!")
    // }else{
    //   if(this.currentUser == null){
    //     this.router.navigate(['/login'])
    //   }else{
    //     this.usuario= 1       
    //   }
    // }

    if(this.currentUser == null){
      this.router.navigate(['/login'])
    }else{
      this.usuario= 1       
    }
  }

  isLoggedAdmin(){
    if(this.currentUser != null && this.usuario == 1){
      return true
    }else{
      return false
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    
    if(this.usuario != null){
      return true
    }else{
      this.router.navigate(['/login'])
      return false
    }
  }

}