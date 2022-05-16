import { Guard } from '../../auth/guard';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES_ADMIN: RouteInfo[]= [
    // { path: '/dashboard', title: 'Mapa',  icon:'fas fa-map text-primary', class: '' },
    { path: '/registro_localizacao', title: 'Registro localização',  icon:'fas fa-book text-primary', class: '' },
    { path: '/minha_conta', title: 'Minha conta',  icon:'ni-single-02 text-blue', class: '' },
    { path: '/usuario', title: 'Usuários',  icon:'fa fa-users text-warning', class: '' },
    { path: '/registro', title: 'Criar nova conta',  icon:'fas fa-user text-dark', class: '' },
    { path: '/gerenciar', title: 'Controle entrada',  icon:'fas fa-users text-danger', class: '' },
    { path: '/streaming_face', title: 'Gerenciar câmera',  icon:'fas fa-camera text-primary', class: '' },
    // { path: '/stream_ocr', title: 'Controle OCR',  icon:'fas fa-camera text-primary', class: '' },
    { path: '/livro_ocorrencia', title: 'Livro ocorrência',  icon:'fas fa-book text-danger', class: '' }
]

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed= true;

  constructor(private router: Router, private auth: Guard) { }

  ngOnInit() {
    if(this.auth.isLoggedAdmin()){
      this.menuItems= ROUTES_ADMIN.filter(menuItem=> menuItem);
      this.router.events.subscribe((event)=> {
        this.isCollapsed= true;
      })
    }  
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login'])
  }

}
