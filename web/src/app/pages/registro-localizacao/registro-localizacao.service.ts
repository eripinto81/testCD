import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { URL_API, httpOptions, API_FACE, TOKEN_API } from '../../../CONFIG_API';
import { tap, mapTo, share } from 'rxjs/operators';

@Injectable()
export class RegistroLocalizacaoService {

  constructor(private http: HttpClient, private socket: Socket) { }

  listarLocalizacao(): Observable<any>{
    return this.http.get(`${URL_API}/listar_localizacao`, httpOptions).pipe(share());
  }

  buscaLocalizacao(nome, data): Observable<any>{
    const dado= { nome: nome, data: data }    
    return this.http.post(`${URL_API}/busca_localizacao`, dado, httpOptions).pipe(share());
  }

}
