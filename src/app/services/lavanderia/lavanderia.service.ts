import { Injectable } from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LavanderiaService {

  private URL_LAVANDERA = `${Globals.UriRioSulApi}Lavanderia`;

  constructor(private _http: HttpClient) {
  }

  listSegundas(param = '') {
    const url = `${this.URL_LAVANDERA}/ObtieneDefectoLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers});
  }

  updateSegunda(defecto) {
    const url = `${this.URL_LAVANDERA}/ActualizaDefectoLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(defecto);
    // const params = new HttpParams().append('Key', atob(Globals.PasswordKey));
    return this._http.put(url, body, {headers});
  }

  inactivaActiva(id) {
    const url = `${this.URL_LAVANDERA}/ActivaInactivaLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdLavanderia', id);
    return this._http.put(url, null, {headers, params});
  }
}
