import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { URL_API, httpOptions } from '../../../CONFIG_API';
import { EmailValidator } from '@angular/forms';
import { tap, mapTo, share } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  login(email: EmailValidator, senha: string): Observable<any>{
    const md5= new Md5();
    const auth= { 'email': email, 'senha': md5.appendStr(senha).end() }    
    return this.http.post(`${URL_API}/login`, auth, httpOptions).pipe(share());
  }

  recuperarSenha(email: EmailValidator): Observable<any>{
    const auth= { 'email': email }    
    return this.http.post(`${URL_API}/enviar_senha`, auth, httpOptions).pipe(share());
  }

}
