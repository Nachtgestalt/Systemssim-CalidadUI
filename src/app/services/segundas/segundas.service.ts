import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Globals} from '../../Globals';

@Injectable({
  providedIn: 'root'
})
export class SegundasService {

  private URL_SEGUNDAS = `${Globals.UriRioSulApi}CatalogoSegundas`;

  constructor(private _http: HttpClient) {
  }

  createSegundas(segunda) {
    const url = `${this.URL_SEGUNDAS}/GuardaSegundaPorcentajes`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(segunda);
    // const params = new HttpParams().append('Key', atob(Globals.PasswordKey));
    return this._http.post(url, body, {headers});
  }

  listSegundas(param = '') {
    const url = `${this.URL_SEGUNDAS}/ObtieneEstilosApp`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers});
  }

  updateSegunda(segunda) {
    const url = `${this.URL_SEGUNDAS}/EditaSegundaPorcentajes`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const body = JSON.stringify(segunda);
    const params = new HttpParams().append('Key', atob(Globals.PasswordKey));
    return this._http.post(url, body, {headers, params});
  }
}
