import {Injectable} from '@angular/core';
import {Globals} from '../../Globals';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfeccionService {
  private URL_CONFECCION = `${Globals.UriRioSulApi}Confeccion`;

  constructor(private _http: HttpClient) {}

  // ================ Defectos ===================
  listDefectos(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CONFECCION}/ObtieneDefectoConfeccion`;
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

  getDefecto(id) {
    const url = `${this.URL_CONFECCION}/ObtieneInfoDefectoConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  validaDefectoExiste(clave, nombre, id?) {
    const url = `${this.URL_CONFECCION}/ValidaDefectoConfeccionSubModulo`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('Clave', clave);
    params = params.append('Nombre', nombre);
    if (id) {
      params = params.append('ID', id);
    }
    return this._http.get(url, {headers, params});
  }


  createDefecto(payload) {
    const url = `${this.URL_CONFECCION}/NuevoDefectoConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updateDefecto(payload) {
    const url = `${this.URL_CONFECCION}/ActualizaDefectoConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.put(url, body, {headers});
  }

  inactivaActivaDefecto(id) {
    const url = `${this.URL_CONFECCION}/ActivaInactivaDefectoConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdDefecto', id);
    return this._http.put(url, null, {headers, params});
  }

  deleteDefecto(id) {
    const url = `${this.URL_CONFECCION}/Defecto`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  // ================ Operaciones ===================
  listOperaciones(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CONFECCION}/ObtieneOperacionConfeccion`;
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

  getOperacion(id) {
    const url = `${this.URL_CONFECCION}/ObtieneInfoOperacionConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  validaOperacionExiste(clave, nombre, id?) {
    const url = `${this.URL_CONFECCION}/ValidaOperacionSubModulo`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('Clave', clave);
    params = params.append('Nombre', nombre);
    if (id) {
      params = params.append('ID', id);
    }
    return this._http.get(url, {headers, params});
  }

  createOperacion(payload) {
    const url = `${this.URL_CONFECCION}/NuevoOperacionConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updateOperacion(payload) {
    const url = `${this.URL_CONFECCION}/ActualizaOperacionConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.put(url, body, {headers});
  }

  inactivaActivaOperacion(id) {
    const url = `${this.URL_CONFECCION}/ActivaInactivaOperacionConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdOperacion', id);
    return this._http.put(url, null, {headers, params});
  }

  deleteOperacion(id) {
    const url = `${this.URL_CONFECCION}/Operacion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  // ================ Areas ===================
  listAreas(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CONFECCION}/ObtieneAreaConfeccion`;
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

  getArea(id) {
    const url = `${this.URL_CONFECCION}/ObtieneInfoAreaConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    return this._http.get(url, {headers, params});
  }

  validaAreaExiste(clave, nombre, id?) {
    const url = `${this.URL_CONFECCION}/ValidaAreaSubModulo`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('Clave', clave);
    params = params.append('Nombre', nombre);
    if (id) {
      params = params.append('ID', id);
    }
    return this._http.get(url, {headers, params});
  }

  createArea(payload) {
    const url = `${this.URL_CONFECCION}/NuevoAreaConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updateArea(payload) {
    const url = `${this.URL_CONFECCION}/ActualizaAreaConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.put(url, body, {headers});
  }

  inactivaActivaArea(id) {
    const url = `${this.URL_CONFECCION}/ActivaInactivaAreaConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdArea', id);
    return this._http.put(url, null, {headers, params});
  }

  deleteArea(id) {
    const url = `${this.URL_CONFECCION}/Area`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }

  // ================ Plantas ===================
  listPlantas(clave = '', nombre = '', activo?) {
    const url = `${this.URL_CONFECCION}/ObtienePlantasDynamics`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // let params = new HttpParams();
    // if (clave !== '') {
    //   params = params.append('Clave', clave);
    // }
    // if (nombre !== '') {
    //   params = params.append('Nombre', nombre);
    // }
    // if (activo) {
    //   params = params.append('Activo', activo);
    // }
    return this._http.get(url, {headers});
  }

  getPlanta(id) {
    const url = `${this.URL_CONFECCION}/ObtieneAreasRelPlantas`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('Planta', id);
    return this._http.get(url, {headers, params});
  }

  createPlanta(payload) {
    const url = `${this.URL_CONFECCION}/NuevaPlantaArea`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    return this._http.post(url, JSON.stringify(payload), {headers});
  }

  updatePlanta(payload) {
    const url = `${this.URL_CONFECCION}/AreaPlanta`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    // const params = new HttpParams().append('ID', id);
    const body = JSON.stringify(payload);
    return this._http.put(url, body, {headers});
  }

  inactivaActivaPlanta(id) {
    const url = `${this.URL_CONFECCION}/ActivaInactivaPlantaConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('IdPlanta', id);
    return this._http.put(url, null, {headers, params});
  }

  deletePlanta(id) {
    const url = `${this.URL_CONFECCION}/Planta`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    const params = new HttpParams().append('ID', id);
    // params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }


  deleteConfeccion(id, catalogo) {
    const url = `${this.URL_CONFECCION}/EliminaConfeccion`;
    const headers = new HttpHeaders().append('content-type', 'application/json');
    let params = new HttpParams().append('ID', id);
    params = params.append('tipo', catalogo);
    return this._http.delete(url, {headers, params});
  }
}
