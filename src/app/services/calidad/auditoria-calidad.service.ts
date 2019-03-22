import { Injectable } from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaCalidadService {

  private URL_CALIDAD = `${Globals.UriRioSulApi}AuditoriaCalidad`;

  constructor(private _http: HttpClient) { }

  createAuditoria(auditoria) {
    const url = `${this.URL_CALIDAD}/NuevaAuditoriaCalidad`;
    const body = JSON.stringify(auditoria);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  updateAuditoria(auditoria) {
    const url = `${this.URL_CALIDAD}/ActualizaAuditoriaDet`;
    const body = JSON.stringify(auditoria);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.put(url, body, {headers});
  }

  deleteAuditoria(id) {
    const url = `${this.URL_CALIDAD}/EliminaAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdAuditoria', id);
    return this._http.delete(url, {headers, params});
  }

  listOT() {
    const url = `${Globals.UriRioSulApi}AuditoriaTerminado/ObtenemosOT`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers});
  }

  getAuditoriaDetail(id) {
    const url = `${this.URL_CALIDAD}/ObtieneAuditoriaDet`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('id', id);
    return this._http.get(url, {headers, params});
  }

  getDetailOT(ot) {
    const url = `${Globals.UriRioSulApi}AuditoriaTerminado/ObtenemosOT_D`;
    const params = new HttpParams().append('OT', ot);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params});
  }

  listAuditorias() {
    const url = `${this.URL_CALIDAD}/ObtieneAuditoriaCalidad`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers});
  }
}
