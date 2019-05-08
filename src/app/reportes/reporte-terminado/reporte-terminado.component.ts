import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ReportesService} from '../../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-reporte-terminado',
  templateUrl: './reporte-terminado.component.html',
  styleUrls: ['./reporte-terminado.component.css']
})
export class ReporteTerminadoComponent implements OnInit {

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

  generarReporte() {
    if (this.formFilter.invalid) {
      Object.keys(this.formFilter.controls).forEach(field => { // {1}
        const control = this.formFilter.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    const fechaInicio = moment(this.formFilter.get('Fecha_i').value).format('YYYY-MM-DD');
    const fechaFin = moment(this.formFilter.get('Fecha_f').value).format('YYYY-MM-DD');
    this._reporteService.composturas(fechaInicio, fechaFin)
      .subscribe(
        imprimirResp => {
          const pdfResult: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp)
          );
          window.open(pdfResult.changingThisBreaksApplicationSecurity);
          console.log(pdfResult);
        });
  }

  reset() {
    this.initFormGroupFilter();
  }

}
