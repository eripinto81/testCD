import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_FACE, URL_API, httpOptions } from '../../../CONFIG_API';
import { tap, mapTo, share } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LivroOcorrenciaService {

  constructor(private http: HttpClient) { }

  adicionarOcorrencia(descricao_ocorrencia, data): Observable<any>{
    const dado= { descricao_ocorrencia: descricao_ocorrencia, data: data }    
    return this.http.post(`${URL_API}/adicionar_ocorrencia`, dado, httpOptions).pipe(share());
  }

  buscaOcorrencia(descricao_ocorrencia, data): Observable<any>{
    const dado= { descricao_ocorrencia: descricao_ocorrencia, data: data }    
    return this.http.post(`${URL_API}/busca_ocorrencia`, dado, httpOptions).pipe(share());
  }

  atualizarOcorrencia(descricao_ocorrencia, id_ocorrencia): Observable<any>{
    const dado= { descricao_ocorrencia: descricao_ocorrencia, id_ocorrencia: id_ocorrencia }    
    return this.http.post(`${URL_API}/atualizar_ocorrencia`, dado, httpOptions).pipe(share());
  }

  listaOcorrencia(): Observable<any>{
    return this.http.get(`${URL_API}/lista_ocorrencia`, httpOptions).pipe(share());
  }

}
