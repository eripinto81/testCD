import { HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';

// export const URL_API= 'https://www.segurancaam.com.br:8081'
// export const API_FACE= 'https://www.segurancaam.com.br:8082'

export const URL_API= 'http://10.10.47.160:8081'
export const API_FACE= 'http://10.10.47.160:8082'

// export const URL_API= 'http://localhost:8081'
// export const API_FACE= 'http://localhost:8082'

export const TOKEN_API= 'bb57810aa6acb1887ccecfc6809ecb67'

export const httpOptions= {
    headers: new HttpHeaders({
        'Content-type'  : 'application/json',  
        'Accept'        : 'application/json',
        'x-access-token': TOKEN_API
    })
}

export function gerarID()
{
    const tamanho= 10;
    const letras= '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let aleatorio= '';
    for (var i= 0; i < tamanho; i++) {
        var rnum = Math.floor(Math.random() * letras.length);
        aleatorio += letras.substring(rnum, rnum + 1);
    }
    const texto= aleatorio+(new Date())
    const md5= new Md5();
    const id_= md5.appendStr(texto).end()
    return id_.substring(0,250)
}
