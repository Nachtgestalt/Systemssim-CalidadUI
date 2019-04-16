import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../Globals';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }

  get(url: string) {
    return this.http.get(`${Globals.UriRioSulApi}${url}`);
  }
}
