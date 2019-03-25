import { Injectable } from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private URL_REPORTE = `${Globals.UriRioSulApi}ReporteConsulta`;

  constructor(private _http: HttpClient) { }

  getReporte(id, tipoAuditoria, tipoReporte?) {
    const url = `${this.URL_REPORTE}/GetConsulta`;
    let params = new HttpParams().append('idAuditoria', id);
    params = params.append('auditoria', tipoAuditoria);
    if (tipoReporte) {
      params = params.append('tipo', tipoReporte);
    }
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers: headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log('RECIBO SERVICE - IMPRIMIR RECIBO', res);
          return new Blob([res], { type: 'application/pdf' });
        })
      );

  }
}
