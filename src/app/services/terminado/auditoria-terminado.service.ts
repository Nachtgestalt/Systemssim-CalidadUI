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
