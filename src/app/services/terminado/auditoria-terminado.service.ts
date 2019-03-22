import { Injectable } from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaTerminadoService {

  private URL_TERMINADO = `${Globals.UriRioSulApi}AuditoriaTerminado`;

  constructor(private _http: HttpClient) { }

  createAuditoria(auditoria) {
    const url = `${this.URL_TERMINADO}/NuevaAuditoriaTerminado`;
    const body = JSON.stringify(auditoria);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  updateAuditoria(auditoria) {
    const url = `${this.URL_TERMINADO}/ActualizaAuditoriaDet`;
    const body = JSON.stringify(auditoria);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.put(url, body, {headers});
  }

  deleteAuditoria(id) {
    const url = `${this.URL_TERMINADO}/ActualizaAuditoriaDet`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdAuditoriaDet', id);
    return this._http.delete(url, {headers, params});
  }

  getAuditoriaDetail(id) {
    const url = `${this.URL_TERMINADO}/ObtieneAuditoriaDet`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('id', id);
    return this._http.get(url, {headers, params});
  }

  listOT() {
    const url = `${this.URL_TERMINADO}/ObtenemosOT`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers});
  }

  getDetailOT(ot) {
    const url = `${this.URL_TERMINADO}/ObtenemosOT_D`;
    const params = new HttpParams().append('OT', ot);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params});
  }

  listAuditorias() {
    const url = `${this.URL_TERMINADO}/ObtieneAuditoriaTerminado`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers});
  }

}
