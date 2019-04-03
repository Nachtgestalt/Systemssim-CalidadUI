import { Injectable } from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LavanderiaService {

  private URL_LAVANDERA = `${Globals.UriRioSulApi}Lavanderia`;

  constructor(private _http: HttpClient) {}

  listDefectos(clave = '', nombre = '', activo?) {
    const url = `${this.URL_LAVANDERA}/ObtieneDefectoLavanderia`;
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

  updateDefecto(defecto) {
    const url = `${this.URL_LAVANDERA}/ActualizaDefectoLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(defecto);
    return this._http.put(url, body, {headers});
  }

  deleteDefecto(id, catalogo) {
    const url = `${this.URL_LAVANDERA}/EliminaLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('IdLavanderia', id);
    params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  inactivaActivaDefecto(id) {
    const url = `${this.URL_LAVANDERA}/ActivaInactivaLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdLavanderia', id);
    return this._http.put(url, null, {headers, params});
  }


  // ================ Operaciones ===================

  listOperaciones(clave = '', nombre = '', activo?) {
    const url = `${this.URL_LAVANDERA}/OperacionLavanderia`;
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

  getOperacion(id) {
    const url = `${this.URL_LAVANDERA}/OperacionLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createOperacion(operacion) {
    const url = `${this.URL_LAVANDERA}/OperacionLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(operacion);
    return this._http.post(url, body, {headers});
  }

  validaOperacionExiste(clave, nombre) {
    const url = `${this.URL_LAVANDERA}/ValidaOperacionSubModuloLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('SubModulo', '13');
    params = params.append('Clave', clave);
    params = params.append('Nombre', nombre);
    return this._http.get(url, {headers, params});
  }

  inactivaActivaOperacion(id) {
    const url = `${this.URL_LAVANDERA}/ActivaInactivaOperacionesLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdLavanderia', id);
    return this._http.put(url, null, {headers, params});
  }

  updateOperación(payload, id) {
    const url = `${this.URL_LAVANDERA}/OperacionLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.put(url, body, {headers, params});
  }

  // ================ Posiciones ===================
  listPosiciones(clave = '', nombre = '', activo?) {
    const url = `${this.URL_LAVANDERA}/PosicionLavanderia`;
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

  getPosicion(id) {
    const url = `${this.URL_LAVANDERA}/PosicionLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createPosicion(operacion) {
    const url = `${this.URL_LAVANDERA}/PosicionLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(operacion);
    return this._http.post(url, body, {headers});
  }

  validaPosicionExiste(clave, nombre) {
    const url = `${this.URL_LAVANDERA}/ValidaOperacionSubModuloLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('SubModulo', '13');
    params = params.append('Clave', clave);
    params = params.append('Nombre', nombre);
    return this._http.get(url, {headers, params});
  }

  inactivaActivaPosicion(id) {
    const url = `${this.URL_LAVANDERA}/ActivaInactivaPosicionLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdLavanderia', id);
    return this._http.put(url, null, {headers, params});
  }

  updatePosicion(payload) {
    const url = `${this.URL_LAVANDERA}/ActivaInactivaOperacionesLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(payload);
    return this._http.put(url, body, {headers});
  }

}
