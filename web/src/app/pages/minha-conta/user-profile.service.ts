import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API, httpOptions } from '../../../CONFIG_API';
import { tap, mapTo, share } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class UserProfileService {

  constructor(private http: HttpClient){}

  obterUsuario(usuario): Observable<any>{
    const u= { id: usuario }          
    return this.http.post(`${URL_API}/obter_usuario`, u, httpOptions).pipe(share());
  }

  alterarSenhaUsuario(id, senha): Observable<any>{
    const alterar_senha= { id: id, senha: senha }    
    return this.http.post(`${URL_API}/alterar_senha`, alterar_senha, httpOptions).pipe(share());
  }

  alterarDadosUsuario(id, usuario): Observable<any>{        
    const dado= { id: id, telefone: usuario.telefone }
    return this.http.post(`${URL_API}/alterar_usuario`, dado, httpOptions).pipe(share());
  }

}