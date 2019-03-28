import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Globals} from '../../Globals';

@Injectable({
  providedIn: 'root'
})
export class TerminadoService {
  private URL_TERMINADO = `${Globals.UriRioSulApi}Terminado`;

  constructor(private _http: HttpClient) {
  }

  createDefecto(defecto) {
    const url = `${this.URL_TERMINADO}/NuevoDefectoTerminado`;
    const formData: FormData = new FormData();
    formData.append('IdSubModulo', defecto.IdSubModulo);
    formData.append('IdUsuario', defecto.IdUsuario);
    formData.append('Clave', defecto.Clave);
    formData.append('Nombre', defecto.Nombre);
    formData.append('Descripcion', defecto.Descripcion);
    formData.append('Observaciones', defecto.Observaciones);
    formData.append('Imagen', defecto.Imagen, defecto.Imagen.name);
    // const body = JSON.stringify(defecto);
    // const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, formData);
  }

  listDefectos(clave = '', nombre = '', activo?) {
    console.log('PARAMS: ', activo);
    const url = `${this.URL_TERMINADO}/ObtieneDefecto`;
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

  deleteDefecto(id) {
    const url = `${this.URL_TERMINADO}/Defecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.delete(url, {headers, params});
  }

  getDefecto(id) {
    const url = `${this.URL_TERMINADO}/ObtieneInfoDefectoTerminado`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  updateDefecto(defecto) {
    const url = `${this.URL_TERMINADO}/ActualizaDefecto`;
    const body = JSON.stringify(defecto);
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, body, {headers});
  }

  inactivaActiva(id) {
    const url = `${this.URL_TERMINADO}/ActivaInactivaDefecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.put(url, null, {headers, params});

  }
}
