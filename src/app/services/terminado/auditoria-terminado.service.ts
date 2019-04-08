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

  cierreAuditoria(id) {
    const url = `${this.URL_TERMINADO}/CierreAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdAuditoria', id);
    return this._http.put(url, null, {headers, params});
  }

  deleteAuditoria(id) {
    const url = `${this.URL_TERMINADO}/EliminaAuditoria`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdAuditoria', id);
    return this._http.delete(url, {headers, params});
  }

  getAuditoriaDetail(id, tipo?) {
    const url = `${this.URL_TERMINADO}/ObtieneAuditoriaDet`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('id', id);
    if (tipo) {
      params = params.append('tipo', tipo);
    }
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

export class Utility {
  public static convertModelToFormData(model: any, form: FormData = null, namespace = ''): FormData {
    let formData = form || new FormData();
    let formKey;

    for (let propertyName in model) {
      if (!model.hasOwnProperty(propertyName) || !model[propertyName]) continue;
      let formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
      if (model[propertyName] instanceof Date)
        formData.append(formKey, model[propertyName].toISOString());
      else if (model[propertyName] instanceof Array) {
        model[propertyName].forEach((element, index) => {
          const tempFormKey = `${formKey}[${index}]`;
          this.convertModelToFormData(element, formData, tempFormKey);
        });
      }
      else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File))
        this.convertModelToFormData(model[propertyName], formData, formKey);
      else
        formData.append(formKey, model[propertyName].toString());
    }
    return formData;
  }
}
