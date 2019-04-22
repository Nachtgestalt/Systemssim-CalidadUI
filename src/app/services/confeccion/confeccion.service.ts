import {Injectable} from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfeccionService {
  private URL_CONFECCION = `${Globals.UriRioSulApi}Confeccion`;

  constructor(private _http: HttpClient) {}

  // ================ Defectos ===================
  listDefectos(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CONFECCION}/ObtieneDefectoConfeccion`;
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

  getDefecto(id) {
    const url = `${this.URL_CONFECCION}/ObtieneInfoDefectoConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createDefecto(payload) {
    const url = `${this.URL_CONFECCION}/NuevoDefectoConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updateDefecto(payload) {
    const url = `${this.URL_CONFECCION}/ActualizaDefectoConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.post(url, body, {headers});
  }

  inactivaActivaDefecto(id) {
    const url = `${this.URL_CONFECCION}/ActivaInactivaDefectoConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdDefecto', id);
    return this._http.get(url, {headers, params});
  }

  deleteDefecto(id) {
    const url = `${this.URL_CONFECCION}/Defecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }
}
