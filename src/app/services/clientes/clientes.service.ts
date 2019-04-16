import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Globals} from '../../Globals';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private URL_CLIENTES = `${Globals.UriRioSulApi}Cliente`;

  constructor(private _http: HttpClient) { }

  listClientes() {
    const url = `${this.URL_CLIENTES}/ObtieneClientes`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers});
  }

  listMarcas(idCliente, modulo) {
    const url = `${this.URL_CLIENTES}/GetMarca`;
    const body = {
      IdCliente: idCliente,
      Auditoria: modulo
    };
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  listPO(filtros) {
    const url = `${this.URL_CLIENTES}/GetPO`;
    const body = filtros;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  listCortes(filtros) {
    const url = `${this.URL_CLIENTES}/GetCorte`;
    const body = filtros;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  listPlanta(planta) {
    const url = `${this.URL_CLIENTES}/GetPlanta`;
    const params = new HttpParams().append('planta', planta);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params});
  }

  listEstilo(estilo) {
    const url = `${this.URL_CLIENTES}/GetEstilo`;
    const params = new HttpParams().append('estilo', estilo);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers, params});
  }

  busqueda(filtro) {
    const url = `${Globals.UriRioSulApi}ReporteConsulta/GetConsulta`;
    const body = filtro;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  listClienteMarcas() {
    const url = `${this.URL_CLIENTES}/Marcas`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.get(url, {headers});
  }

  createClienteMarcas(payload) {
    const url = `${this.URL_CLIENTES}/ClienteMarcas`;
    const body = payload;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  getClienteMarca(id) {
    const url = `${this.URL_CLIENTES}/ClienteMarcas`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('idCliente', id);
    return this._http.get(url, {headers, params});
  }
}
