import { Md5 } from 'ts-md5/dist/md5';
import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API, httpOptions } from '../../../CONFIG_API';
import LOCALE_ID from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { tap, mapTo, share } from 'rxjs/operators';
import { Observable } from 'rxjs';

registerLocaleData(ptBr)

@NgModule({
  providers: [{ provide: LOCALE_ID, useValue: 'pt-PT' }]
})

@Injectable()
export class RegisterService {

  constructor(private http: HttpClient){}

  registrar(usuario){
    const md5= new Md5();
    const dados_usuario= {  
                            nome_usuario : usuario.nome.toUpperCase(),
                            cpf_usuario: usuario.cpf,
                            matricula: usuario.matricula,
                            contato : usuario.contato,
                            fk_id_unidade: usuario.unidade,
                            email : usuario.email.toLowerCase(),
                            senha : md5.appendStr(usuario.senha).end().toString()
                          }                          
    return this.http.post(`${URL_API}/cadastrar_usuario`, dados_usuario, httpOptions).pipe(share());                     
  }

  listarUnidade(){
    return this.http.get(`${URL_API}/listar_unidade`, httpOptions).pipe(share());
  }

  consultarEmail(email){
    const dado_email= { email: email }
    return this.http.post(`${URL_API}/verificar_email`, dado_email, httpOptions).pipe(share());
  }
   
}