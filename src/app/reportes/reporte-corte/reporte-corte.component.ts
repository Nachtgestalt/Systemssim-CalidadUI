import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ReportesService} from '../../services/reportes/reportes.service';
import * as moment from 'moment';
import {forkJoin} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-reporte-corte',
  templateUrl: './reporte-corte.component.html',
  styleUrls: ['./reporte-corte.component.css']
})
export class ReporteCorteComponent implements OnInit {

  formFilter: FormGroup;

  constructor(private _reporteService: ReportesService,
              private domSanitizer: DomSanitizer) {
  }

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

  generarReporteCtrlCorte() {
    if (this.formFilter.invalid) {
      Object.keys(this.formFilter.controls).forEach(field => { // {1}
        const control = this.formFilter.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    const fechaInicio = moment(this.formFilter.get('Fecha_i').value).format('YYYY-MM-DD');
    const fechaFin = moment(this.formFilter.get('Fecha_f').value).format('YYYY-MM-DD');
    const reporteMArca$ = this._reporteService.limitesCtrlCorte(fechaInicio, fechaFin);
    const reporteMArcaGrafico$ = this._reporteService.limitesCtrlCorteGrafico(fechaInicio, fechaFin);
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

  generarReporteRefilado() {
    if (this.formFilter.invalid) {
      Object.keys(this.formFilter.controls).forEach(field => { // {1}
        const control = this.formFilter.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    const fechaInicio = moment(this.formFilter.get('Fecha_i').value).format('YYYY-MM-DD');
    const fechaFin = moment(this.formFilter.get('Fecha_f').value).format('YYYY-MM-DD');
    const reporteMArca$ = this._reporteService.refiladoCortador(fechaInicio, fechaFin);
    const reporteMArcaGrafico$ = this._reporteService.refiladoCortadorGrafico(fechaInicio, fechaFin);
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
}
