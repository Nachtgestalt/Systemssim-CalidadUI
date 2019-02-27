import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Globals} from '../../Globals';

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {

  private URL_TERMINADO = `${Globals.UriRioSulApi}Terminado`;

  constructor(private _http: HttpClient) { }

  createOperacion(operacion) {
    const url = `${this.URL_TERMINADO}/NuevaOperacionTerminado`;
    const body = JSON.stringify(operacion);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  listOperaciones(clave, nombre) {
    const url = `${this.URL_TERMINADO}/ObtieneOperacionTerminados`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams();
    if (clave !== '') {
      params = params.append('Clave', clave);
    }
    if (nombre !== '') {
      params = params.append('Nombre', nombre);
    }
    return this._http.get(url, {headers, params});
  }

  getOperacion(id) {
    const url = `${this.URL_TERMINADO}/ObtieneInfOperacionTerminado`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  updateOperacion(operacion) {
    const url = `${this.URL_TERMINADO}/ActualizaOperacionTerminado`;
    const body = JSON.stringify(operacion);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  inactivaActiva(id) {
    const url = `${this.URL_TERMINADO}/ActivaInactivaOperacion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});

  }
}
