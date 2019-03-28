import { Injectable } from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PosicionTerminadoService {

  private URL_TERMINADO = `${Globals.UriRioSulApi}Terminado`;

  constructor(private _http: HttpClient) { }

  createPosicion(posicion) {
    const url = `${this.URL_TERMINADO}/NuevaPosicionT`;
    const body = JSON.stringify(posicion);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  listPosiciones(clave = '', nombre = '', activo?) {
    const url = `${this.URL_TERMINADO}/ObtienePosicionT`;
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

  deletePosicion(id) {
    const url = `${this.URL_TERMINADO}/Posicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.delete(url, {headers, params});
  }

  getPosicion(id) {
    const url = `${this.URL_TERMINADO}/ObtieneInfPosicionT`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  updatePosicion(posicion) {
    const url = `${this.URL_TERMINADO}/ActualizaPosicionT`;
    const body = JSON.stringify(posicion);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  inactivaActiva(id) {
    const url = `${this.URL_TERMINADO}/ActivaInactivaPosicionT`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.put(url, null, {headers, params});
  }
}
