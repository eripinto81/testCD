import { HttpClient } from '@angular/common/http';
import { Guard } from '../../auth/guard';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES_ADMIN } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  public listTitles: any[];
  public location: Location;
  private nome_usuario= null;
    
  constructor(location: Location, private element: ElementRef, private router: Router, private auth: Guard, private http: HttpClient, public toastr: ToastrManager) {
    this.location= location;
    const currentUser= JSON.parse(localStorage.getItem('currentUser'));    
    if(currentUser == null){
      this.toastr.infoToastr("Você não está logado!")
    }else{     
      this.nome_usuario= currentUser.nome
    }
  }

  ngOnInit() {
    if(this.auth.isLoggedAdmin()){
      this.listTitles= ROUTES_ADMIN.filter(listTitle => listTitle);
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login'])
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 2 );
    }
    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'SSP-AM';
  }

}
