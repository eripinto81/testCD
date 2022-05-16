import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_FACE, URL_API, httpOptions } from '../../../CONFIG_API';
import { tap, mapTo, share } from 'rxjs/operators';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  findMap(address): Observable<any>{
    // return this.http.get(`${URL_API}/buscar_local/${address}`, httpOptions)
    return this.http.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=geojson&limit=1`).pipe(share());
  }

}
