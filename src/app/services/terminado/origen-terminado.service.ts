import { Injectable } from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrigenTerminadoService {

  private URL_TERMINADO = `${Globals.UriRioSulApi}Terminado`;

  constructor(private _http: HttpClient) { }

  createOrigen(origen) {
    const url = `${this.URL_TERMINADO}/NuevoOrigenT`;
    const body = JSON.stringify(origen);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  listOrigenes(clave = '', nombre = '', activo?) {
    const url = `${this.URL_TERMINADO}/ObtieneOrigenT`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams();
    if (clave !== '') {
      params = params.append('Clave', clave);
    }
    if (nombre !== '') {
      params = params.append('Nombre', nombre);
    }
    if (activo) {
      params = params.append('Activo', activo);
    }
    return this._http.get(url, {headers, params});
  }

  deleteOrigen(id) {
    const url = `${this.URL_TERMINADO}/Origen`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.delete(url, {headers, params});
  }

  getOrigen(id) {
    const url = `${this.URL_TERMINADO}/ObtieneInfOrigenT`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  updateOrigen(origen) {
    const url = `${this.URL_TERMINADO}/ActualizaOrigenT`;
    const body = JSON.stringify(origen);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  inactivaActiva(id) {
    const url = `${this.URL_TERMINADO}/ActivaInactivaOrigenT`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.put(url, null, {headers, params});
  }
}
