import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API, httpOptions } from '../../../CONFIG_API';
import { tap, mapTo, share } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class UsuarioService {

    constructor(private http: HttpClient){}

    listarUsuarios(): Observable<any>{          
        return this.http.get(`${URL_API}/listar_usuario`, httpOptions).pipe(share());
    }

    buscaListarUsuarios(nome_busca, matricula): Observable<any>{  
        const usuarios= { nome_busca: nome_busca, matricula: matricula }        
        return this.http.post(`${URL_API}/buscar_usuario`, usuarios, httpOptions).pipe(share());
    }

    aprovarUsuario(id): Observable<any>{
        const usuario_aprovar= { 'id': id }
        return this.http.post(`${URL_API}/aprovar`, usuario_aprovar, httpOptions).pipe(share());
    }

    bloquearUsuario(id): Observable<any>{
        const usuario_aprovar= { 'id': id }
        return this.http.post(`${URL_API}/bloquear`, usuario_aprovar, httpOptions).pipe(share());
    }

    definirPerfil(id, usuario): Observable<any>{
        const usuario_perfil= { 'id': id, 'id_perfil': usuario.perfil_usuario }
        return this.http.post(`${URL_API}/definir_perfil`, usuario_perfil, httpOptions).pipe(share());
    }

    enviarEmail(email, assunto, texto): Observable<any>{    
        const mensagem= { email:email, assunto: assunto, texto: texto}
        return this.http.post(`${URL_API}/enviar_email`, mensagem, httpOptions).pipe(share());
    }
    
}