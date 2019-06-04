import {Injectable} from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private URL_REPORTE = `${Globals.UriRioSulApi}ReporteConsulta`;

  private URL_REPORTE_COMPOSTURAS = `${Globals.UriRioSulApi}Reportes`;

  constructor(private _http: HttpClient) { }

  consultaGeneral(filtro) {
    const url = `${this.URL_REPORTE}/GetConsultaGeneral`;
    const body = filtro;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

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

   composturas(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/Composturas`;
     let params = new HttpParams().append('Fecha_i', fechaInicial);
     params = params.append('Fecha_f', fechaFinal);
     const headers = new HttpHeaders().append('content-type', 'application/json');
     return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
       .pipe(
         map((res: any) => {
           console.log(res);
           return new Blob([res], { type: 'application/pdf' });
         })
       );
   }

   composturasXMarca(fechaInicial, fechaFinal) {
     const url = `${this.URL_REPORTE_COMPOSTURAS}/ComposturasMarca2`;
     let params = new HttpParams().append('Fecha_i', fechaInicial);
     params = params.append('Fecha_f', fechaFinal);
     const headers = new HttpHeaders().append('content-type', 'application/json');
     return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
       .pipe(
         map((res: any) => {
           console.log(res);
           return new Blob([res], { type: 'application/pdf' });
         })
       );
   }

  composturasXMarcaTotal(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/ComposturasMarca`;
    let params = new HttpParams().append('Fecha_i', fechaInicial);
    params = params.append('Fecha_f', fechaFinal);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], { type: 'application/pdf' });
        })
      );
  }

   composturasXMarcaGrafico(fechaInicial, fechaFinal) {
     const url = `${this.URL_REPORTE_COMPOSTURAS}/ComposturasMarcaGrafico`;
     let params = new HttpParams().append('Fecha_i', fechaInicial);
     params = params.append('Fecha_f', fechaFinal);
     const headers = new HttpHeaders().append('content-type', 'application/json');
     return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
       .pipe(
         map((res: any) => {
           console.log(res);
           return new Blob([res], { type: 'application/pdf' });
         })
       );
   }

  composturasXPlanta(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/ComposturasPlanta2`;
    let params = new HttpParams().append('Fecha_i', fechaInicial);
    params = params.append('Fecha_f', fechaFinal);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], { type: 'application/pdf' });
        })
      );
  }

  composturasXPlantaTotal(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/ComposturasPlanta`;
    let params = new HttpParams().append('Fecha_i', fechaInicial);
    params = params.append('Fecha_f', fechaFinal);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], { type: 'application/pdf' });
        })
      );
  }

  composturasXPlantaGrafico(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/ComposturasPlantaGrafico`;
    let params = new HttpParams().append('Fecha_i', fechaInicial);
    params = params.append('Fecha_f', fechaFinal);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], { type: 'application/pdf' });
        })
      );
  }

  limitesCtrlCorte(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/Corte`;
    let params = new HttpParams().append('Fecha_i', fechaInicial);
    params = params.append('Fecha_f', fechaFinal);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], { type: 'application/pdf' });
        })
      );
  }

  limitesCtrlCorteGrafico(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/CorteGrafico`;
    let params = new HttpParams().append('Fecha_i', fechaInicial);
    params = params.append('Fecha_f', fechaFinal);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], { type: 'application/pdf' });
        })
      );
  }

  refiladoCortador(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/CorteCortadores`;
    let params = new HttpParams().append('Fecha_i', fechaInicial);
    params = params.append('Fecha_f', fechaFinal);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], {type: 'application/pdf'});
        })
      );
  }

  refiladoCortadorGrafico(fechaInicial, fechaFinal) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/CorteCortadoresGrafico`;
    let params = new HttpParams().append('Fecha_i', fechaInicial);
    params = params.append('Fecha_f', fechaFinal);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], {type: 'application/pdf'});
        })
      );
  }

  costoCotizado(ot_i, ot_f, tipo_cambio) {
    const url = `${this.URL_REPORTE_COMPOSTURAS}/CostoCotizado`;
    let params = new HttpParams().append('OT_I', ot_i);
    params = params.append('OT_F', ot_f);
    params = params.append('tipo_cambio', tipo_cambio);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params, responseType: 'arraybuffer' as 'json'})
      .pipe(
        map((res: any) => {
          console.log(res);
          return new Blob([res], {type: 'application/pdf'});
        })
      );
  }
}
