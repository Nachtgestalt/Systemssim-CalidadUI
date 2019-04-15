import {Injectable} from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcesosEspecialesService {

  private URL_PROCESOS = `${Globals.UriRioSulApi}ProcesosEspeciales`;

  private URL_AUDITORIA = `${Globals.UriRioSulApi}AuditoriaProcesosEspeciales`;

  constructor(private _http: HttpClient) {
  }

  listDefectos(clave = '', nombre = '', activo?) {
    const url = `${this.URL_PROCESOS}/Defecto`;
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

  createDefecto(payload) {
    const url = `${this.URL_PROCESOS}/Defecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, payload, {headers});
  }

  updateDefecto(defecto) {
    const url = `${this.URL_PROCESOS}/Defecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(defecto);
    return this._http.put(url, body, {headers});
  }

  deleteDefecto(id, catalogo) {
    const url = `${this.URL_PROCESOS}/EliminaProcesosEspeciales`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('ID', id);
    params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  inactivaActivaDefecto(id) {
    const url = `${this.URL_PROCESOS}/ActivaInactivaDefectoProcesoEsp`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.put(url, null, {headers, params});
  }


  // ================ Operaciones ===================

  listOperaciones(clave = '', nombre = '', activo?) {
    const url = `${this.URL_PROCESOS}/Operacion`;
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
    const url = `${this.URL_PROCESOS}/Operacion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createOperacion(operacion) {
    const url = `${this.URL_PROCESOS}/Operacion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(operacion);
    return this._http.post(url, body, {headers});
  }

  validaOperacionExiste(clave, nombre) {
    const url = `${this.URL_PROCESOS}/ValidaOperacionSubModuloProcesosEspeciales`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('SubModulo', '13');
    params = params.append('Clave', clave);
    params = params.append('Nombre', nombre);
    return this._http.get(url, {headers, params});
  }

  inactivaActivaOperacion(id) {
    const url = `${this.URL_PROCESOS}/ActivaInactivaOperacionesProcesosEspeciales`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.put(url, null, {headers, params});
  }

  updateOperacion(payload, id) {
    const url = `${this.URL_PROCESOS}/Operacion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.put(url, body, {headers, params});
  }

  // ================ Posiciones ===================
  listPosiciones(clave = '', nombre = '', activo?) {
    const url = `${this.URL_PROCESOS}/Posicion`;
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
    const url = `${this.URL_PROCESOS}/Posicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  createPosicion(operacion) {
    const url = `${this.URL_PROCESOS}/Posicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(operacion);
    return this._http.post(url, body, {headers});
  }

  validaPosicionExiste(clave, nombre) {
    const url = `${this.URL_PROCESOS}/ValidaOperacionSubModuloLavanderia`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('SubModulo', '13');
    params = params.append('Clave', clave);
    params = params.append('Nombre', nombre);
    return this._http.get(url, {headers, params});
  }

  inactivaActivaPosicion(id) {
    const url = `${this.URL_PROCESOS}/ActivaInactivaPosicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.put(url, null, {headers, params});
  }

  updatePosicion(payload, id) {
    const url = `${this.URL_PROCESOS}/Posicion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.put(url, body, {headers, params});
  }

// ================ Auditoria ===================
  createAuditoria(data) {
    const url = `${this.URL_AUDITORIA}/AuditoriaProcEsp`;
    const body = JSON.stringify(data);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  updateAuditoria(auditoria) {
    const url = `${this.URL_AUDITORIA}/AuditoriaProcEsp`;
    const body = JSON.stringify(auditoria);
    // const params = new HttpParams().append('ID', auditoria.IdAuditoria);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.put(url, body, {headers});
  }

  cierreAuditoria(id) {
    const url = `${this.URL_AUDITORIA}/CierreAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.put(url, null, {headers, params});
  }

  deleteAuditoria(id) {
    const url = `${this.URL_AUDITORIA}/EliminaAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.delete(url, {headers, params});
  }

  getAuditoriaDetail(id, tipo?) {
    const url = `${this.URL_AUDITORIA}/AuditoriaProcEsp`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('ID', id);
    if (tipo) {
      params = params.append('tipo', tipo);
    }
    return this._http.get(url, {headers, params});
  }
}
