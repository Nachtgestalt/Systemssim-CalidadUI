import {Injectable} from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CorteService {
  private URL_CORTADORES = `${Globals.UriRioSulApi}Cortadores`;

  constructor(private _http: HttpClient) { }

  // ================ Cortadores ===================

  createCortador(payload) {
    const url = `${this.URL_CORTADORES}/NuevoCortador`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  listCortadores(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CORTADORES}/ObtieneCortadores`;
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

  getCortador(id) {
    const url = `${this.URL_CORTADORES}/ObtieneInfoCortador`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  updateCortador(payload) {
    const url = `${this.URL_CORTADORES}/ActualizaCortador`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.post(url, body, {headers});
  }

  inactivaActivaCortador(id) {
    const url = `${this.URL_CORTADORES}/ActivaInactivaCortador`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('Idcortador', id);
    return this._http.get(url, {headers, params});
  }

  deleteCortador(id) {
    const url = `${this.URL_CORTADORES}/Cortador`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdCortador', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  // ================ Defectos ===================
  listDefectos(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CORTADORES}/ObtieneDefecto`;
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
}
