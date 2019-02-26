import { Component, OnInit } from '@angular/core';
import {FileItem} from '../../models/file-item';

@Component({
  selector: 'app-carga-imagenes',
  templateUrl: './carga-imagenes.component.html',
  styleUrls: ['./carga-imagenes.component.css']
})
export class CargaImagenesComponent implements OnInit {

  estaSobreElemento = false;
  archivos: FileItem[] = [];

  constructor() { }

  ngOnInit() {
  }

  // cargarImagenes() {
  //   this._cargaImagenes.cargarImagenesFirebase( this.archivos );
  // }

  limpiarArchivos() {
    this.archivos = [];
  }

}
