import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-reporte-corte',
  templateUrl: './reporte-corte.component.html',
  styleUrls: ['./reporte-corte.component.css']
})
export class ReporteCorteComponent implements OnInit {

  formFilter: FormGroup;
  constructor() { }

  ngOnInit() {
    this.initFormGroupFilter();
  }

  initFormGroupFilter() {
    this.formFilter = new FormGroup({
      'Fecha_i': new FormControl(null, Validators.required),
      'Fecha_f': new FormControl(null, Validators.required),
    });
  }

  reset() {
    this.initFormGroupFilter();
  }
  generarReporte() {

  }
}
