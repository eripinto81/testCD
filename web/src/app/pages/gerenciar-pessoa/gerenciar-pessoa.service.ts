import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { URL_API, httpOptions, API_FACE, TOKEN_API } from '../../../CONFIG_API';
import { tap, mapTo, share } from 'rxjs/operators';

@Injectable()
export class GerenciarPessoaService {

  constructor(private http: HttpClient, private socket: Socket) { }

  listarSetor(): Observable<any>{
    return this.http.get(`${URL_API}/listar_setor`, httpOptions).pipe(share());
  }

  listarSituacao(): Observable<any>{
    return this.http.get(`${URL_API}/listar_situacao`, httpOptions).pipe(share());
  }

  listarRegistro(): Observable<any>{
    return this.http.get(`${URL_API}/listar_registro`, httpOptions).pipe(share());
  }

  adicionarPessoa(cpf_pessoa, nome_pessoa, data_nascimento, fk_id_situacao): Observable<any>{
    const pessoa= { cpf_pessoa: cpf_pessoa, nome_pessoa: nome_pessoa, data_nascimento: data_nascimento, fk_id_situacao: fk_id_situacao }  
    return this.http.post(`${URL_API}/registrar_pessoa`, pessoa, httpOptions).pipe(share());
  }

  adicionarHistorico(id_pessoa, id_setor, data_entrada, data_saida, observacao): Observable<any>{
    const historico= { id_pessoa: id_pessoa, id_setor: id_setor, data_entrada: data_entrada, data_saida: data_saida, observacao: observacao }  
    
    this.socket.emit('registroPessoa', 1);

    return this.http.post(`${URL_API}/registrar_historico`, historico, httpOptions).pipe(share());
  }

  atualizarSaida(data_saida, id_pessoa): Observable<any>{
    const saida= { data_saida: data_saida, id_pessoa: id_pessoa }    
    return this.http.post(`${URL_API}/atualizar_saida_pessoa`, saida, httpOptions).pipe(share());
  }

  buscarCPFAPI(rg): Observable<any>{
    const register= {rg:rg}        
    return this.http.post(`${URL_API}/buscar_cpf`, register, httpOptions).pipe(share());
  }

  buscarAvancada(nome, rg, data_entrada, data_saida): Observable<any>{
    const find= {nome:nome, rg:rg, data_entrada:data_entrada, data_saida:data_saida}        
    return this.http.post(`${URL_API}/busca_avancada_registro`, find, httpOptions).pipe(share());
  }

  bloquear(id_pessoa, situacao): Observable<any>{
    const register= {id_pessoa:id_pessoa, situacao:situacao}        
    return this.http.post(`${URL_API}/bloquear`, register, httpOptions).pipe(share());
  }

  abrirPorta(ip): Observable<any>{
    return this.http.get(`${API_FACE}/abrir_porta?ip=${ip}`, httpOptions).pipe(share());
  }

  // API ANEXO

  adicionarAnexo(nome_arquivo, id_pessoa, id_historico, tipo, tamanho): Observable<any>{
    const add= {nome_arquivo: nome_arquivo, id_pessoa: id_pessoa, id_historico: id_historico, tipo: tipo, tamanho: tamanho}        
    return this.http.post(`${URL_API}/adicionar_anexo`, add, httpOptions).pipe(share());
  }

  pushFileToStorage(file, nome): Observable<any>{
    const formdata: FormData= new FormData();

    formdata.append('file', file, nome);    

    const req= new HttpRequest('POST', `${URL_API}/upload`, formdata, {
      reportProgress: true,
      responseType: 'text',
      headers: new HttpHeaders({
        'x-access-token': TOKEN_API
      })
    })
    return this.http.request(req).pipe(share());
  }

  listarAnexoAPI(): Observable<any>{
    return this.http.get(`${URL_API}/listar_anexo`, httpOptions).pipe(share());
  }

  deletarAnexo(id, file): Observable<any>{
    const rm= {id: id, file: file}        
    return this.http.post(`${URL_API}/deletar_anexo`, rm, httpOptions).pipe(share());
  }

}
