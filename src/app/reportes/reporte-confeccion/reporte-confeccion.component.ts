import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ReportesService} from '../../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as moment from 'moment';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-reporte-confeccion',
  templateUrl: './reporte-confeccion.component.html',
  styleUrls: ['./reporte-confeccion.component.css']
})
export class ReporteConfeccionComponent implements OnInit {

  formFilter: FormGroup;
  constructor(private _reporteService: ReportesService,
              private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.initFormGroupFilter();
  }

  initFormGroupFilter() {
    this.formFilter = new FormGroup({
      'Fecha_i': new FormControl(null, Validators.required),
      'Fecha_f': new FormControl(null, Validators.required),
    });
  }

  generarReporteTotalMarca() {
    if (this.formFilter.invalid) {
      Object.keys(this.formFilter.controls).forEach(field => { // {1}
        const control = this.formFilter.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    const fechaInicio = moment(this.formFilter.get('Fecha_i').value).format('YYYY-MM-DD');
    const fechaFin = moment(this.formFilter.get('Fecha_f').value).format('YYYY-MM-DD');
    const reporteMArca$ = this._reporteService.composturasXMarcaTotal(fechaInicio, fechaFin);
    const reporteMArcaGrafico$ = this._reporteService.composturasXMarcaGrafico(fechaInicio, fechaFin);
    forkJoin(reporteMArca$, reporteMArcaGrafico$)
      .subscribe(
        imprimirResp => {
          const pdfResultMarca: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp[0])
          );
          window.open(pdfResultMarca.changingThisBreaksApplicationSecurity);
          const pdfResultGrafico: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp[1])
          );
          window.open(pdfResultGrafico.changingThisBreaksApplicationSecurity);

        });
  }

  generarReporteMarca() {
    if (this.formFilter.invalid) {
      Object.keys(this.formFilter.controls).forEach(field => { // {1}
        const control = this.formFilter.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    const fechaInicio = moment(this.formFilter.get('Fecha_i').value).format('YYYY-MM-DD');
    const fechaFin = moment(this.formFilter.get('Fecha_f').value).format('YYYY-MM-DD');
    const reporteMArca$ = this._reporteService.composturasXMarca(fechaInicio, fechaFin);
    const reporteMArcaGrafico$ = this._reporteService.composturasXMarcaGrafico(fechaInicio, fechaFin);
    forkJoin(reporteMArca$, reporteMArcaGrafico$)
      .subscribe(
        imprimirResp => {
          const pdfResultMarca: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp[0])
          );
          window.open(pdfResultMarca.changingThisBreaksApplicationSecurity);
          const pdfResultGrafico: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp[1])
          );
          window.open(pdfResultGrafico.changingThisBreaksApplicationSecurity);

        });
  }

  generarReportePlanta() {
    if (this.formFilter.invalid) {
      Object.keys(this.formFilter.controls).forEach(field => { // {1}
        const control = this.formFilter.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    const fechaInicio = moment(this.formFilter.get('Fecha_i').value).format('YYYY-MM-DD');
    const fechaFin = moment(this.formFilter.get('Fecha_f').value).format('YYYY-MM-DD');
    const reporteMArca$ = this._reporteService.composturasXPlanta(fechaInicio, fechaFin);
    const reporteMArcaGrafico$ = this._reporteService.composturasXPlantaGrafico(fechaInicio, fechaFin);
    forkJoin(reporteMArca$, reporteMArcaGrafico$)
      .subscribe(
        imprimirResp => {
          const pdfResultMarca: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp[0])
          );
          window.open(pdfResultMarca.changingThisBreaksApplicationSecurity);
          const pdfResultGrafico: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp[1])
          );
          window.open(pdfResultGrafico.changingThisBreaksApplicationSecurity);

        });
  }

  generarReporteTotalPlanta() {
    if (this.formFilter.invalid) {
      Object.keys(this.formFilter.controls).forEach(field => { // {1}
        const control = this.formFilter.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    const fechaInicio = moment(this.formFilter.get('Fecha_i').value).format('YYYY-MM-DD');
    const fechaFin = moment(this.formFilter.get('Fecha_f').value).format('YYYY-MM-DD');
    const reporteMArca$ = this._reporteService.composturasXPlantaTotal(fechaInicio, fechaFin);
    const reporteMArcaGrafico$ = this._reporteService.composturasXPlantaGrafico(fechaInicio, fechaFin);
    forkJoin(reporteMArca$, reporteMArcaGrafico$)
      .subscribe(
        imprimirResp => {
          const pdfResultMarca: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp[0])
          );
          window.open(pdfResultMarca.changingThisBreaksApplicationSecurity);
          const pdfResultGrafico: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp[1])
          );
          window.open(pdfResultGrafico.changingThisBreaksApplicationSecurity);

        });
  }
  reset() {
    this.initFormGroupFilter();
  }

}
