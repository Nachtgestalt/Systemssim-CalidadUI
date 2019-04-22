import {Injectable} from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaCorteService {

  private URL_AUDITORIA = `${Globals.UriRioSulApi}AuditoriaCorte`;

  constructor(private _http: HttpClient) { }

  getDetalleOT(ot) {
    const url = `${this.URL_AUDITORIA}/ObtieneDatosGeneralesOrdenTrabajo`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('OrdenTrabajo', ot);
    return this._http.get(url, {headers, params});
  }

  getSeries(ot) {
    const url = `${this.URL_AUDITORIA}/ObtieneSerieAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('OT', ot);
    return this._http.get(url, {headers});
  }

  getBultosByOTAndSerie(ot, serie) {
    const url = `${this.URL_AUDITORIA}/ObtieneBultosAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('OT', ot);
    params = params.append('Series', serie);
    return this._http.get(url, {headers, params});
  }

  createAuditoria(auditoria) {
    const url = `${this.URL_AUDITORIA}/NuevaAuditoriaCorte`;
    const body = JSON.stringify(auditoria);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  getAuditoriaDetail(id, tipo?) {
    const url = `${this.URL_AUDITORIA}/ObtieneAuditoriaCortePorId`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('IdAuditoria', id);
    if (tipo) {
      params = params.append('tipo', tipo);
    }
    return this._http.get(url, {headers, params});
  }

  updateAuditoria(auditoria) {
    const url = `${this.URL_AUDITORIA}/AuditoriaCorte`;
    const body = JSON.stringify(auditoria);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.put(url, body, {headers});
  }

  cierreAuditoria(id) {
    const url = `${this.URL_AUDITORIA}/CierreAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdAuditoria', id);
    return this._http.put(url, null, {headers, params});
  }

  deleteAuditoria(id) {
    const url = `${this.URL_AUDITORIA}/EliminaAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.delete(url, {headers, params});
  }
}
