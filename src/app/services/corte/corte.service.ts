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

  getDefecto(id) {
    const url = `${this.URL_CORTADORES}/ObtieneInfoDefecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createDefecto(payload) {
    const url = `${this.URL_CORTADORES}/NuevoDefecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updateDefecto(payload) {
    const url = `${this.URL_CORTADORES}/ActualizaDefecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.post(url, body, {headers});
  }

  inactivaActivaDefecto(id) {
    const url = `${this.URL_CORTADORES}/ActivaInactivaDefecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdDefecto', id);
    return this._http.get(url, {headers, params});
  }

  deleteDefecto(id) {
    const url = `${this.URL_CORTADORES}/Defecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdDefecto', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  // ================ Mesas ===================
  listMesas(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CORTADORES}/ObtieneMesa`;
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

  getMesa(id) {
    const url = `${this.URL_CORTADORES}/ObtieneInfoMesa`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createMesa(payload) {
    const url = `${this.URL_CORTADORES}/NuevoMesa`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updateMesa(payload) {
    const url = `${this.URL_CORTADORES}/ActualizaMesa`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.post(url, body, {headers});
  }

  inactivaActivaMesa(id) {
    const url = `${this.URL_CORTADORES}/ActivaInactivaMesa`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdMesa', id);
    return this._http.get(url, {headers, params});
  }

  deleteMesa(id) {
    const url = `${this.URL_CORTADORES}/Mesa`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdMesa', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  // ================ Posicion ===================
  listPosiciones(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CORTADORES}/ObtienePosicion`;
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
    const url = `${this.URL_CORTADORES}/ObtieneInfoPosicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createPosicion(payload) {
    const url = `${this.URL_CORTADORES}/NuevoPosicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updatePosicion(payload) {
    const url = `${this.URL_CORTADORES}/ActualizaPosicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.post(url, body, {headers});
  }

  inactivaActivaPosicion(id) {
    const url = `${this.URL_CORTADORES}/ActivaInactivaPosicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdPosicion', id);
    return this._http.get(url, {headers, params});
  }

  deletePosicion(id) {
    const url = `${this.URL_CORTADORES}/Posicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdPosicion', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  // ================ Tendido ===================
  listTendidos(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CORTADORES}/ObtieneTendido`;
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

  getTendido(id) {
    const url = `${this.URL_CORTADORES}/ObtieneInfoTendido`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createTendido(payload) {
    const url = `${this.URL_CORTADORES}/NuevoTendido`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updateTendido(payload) {
    const url = `${this.URL_CORTADORES}/ActualizaTendido`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.post(url, body, {headers});
  }

  inactivaActivaTendido(id) {
    const url = `${this.URL_CORTADORES}/ActivaInactivaTendido`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdTendido', id);
    return this._http.get(url, {headers, params});
  }

  deleteTendido(id) {
    const url = `${this.URL_CORTADORES}/Tendido`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdTendido', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }
}
