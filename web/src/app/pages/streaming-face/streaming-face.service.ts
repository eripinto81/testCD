import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_FACE, URL_API, httpOptions } from '../../../CONFIG_API';
import { tap, mapTo, share } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class StreamFaceService {

  constructor(private http: HttpClient) { }

  realodThread(): Observable<any>{
    // VERIFICAR QUANDO REPLICAR REQUISICAO
    return this.http.get(`${API_FACE}/reload_thread_camera`, httpOptions).pipe(share());
  }

  reloadThreadBackgound(): Observable<any>{
    return this.http.get(`${API_FACE}/backgound_thread_camera`, httpOptions).pipe(share());
  }

  adicionarCamera(login, senha, host, porta): Observable<any>{
    const cam= { login: login, senha: senha, host: host, porta: porta }    
    return this.http.post(`${URL_API}/adicionar_camera`, cam, httpOptions).pipe(share());
  }

  deletarCamera(id_camera): Observable<any>{
    const cam= { id_camera: id_camera }    
    return this.http.post(`${URL_API}/deletar_camera`, cam, httpOptions).pipe(share());
  }

  listarCamera(): Observable<any>{
    return this.http.get(`${URL_API}/listar_camera`, httpOptions).pipe(share());
  }

  logMonitoramento(): Observable<any>{
    return this.http.get(`${URL_API}/listar_log_monitoramento`, httpOptions).pipe(share());
  }

  buscarAvancadaRegistro(nome, cpf, data_entrada, data_saida, situacao): Observable<any>{
    const find= {nome:nome, cpf:cpf, data_entrada:data_entrada, data_saida:data_saida, situacao:situacao}        
    return this.http.post(`${URL_API}/busca_registro_face`, find, httpOptions).pipe(share());
  }

}
