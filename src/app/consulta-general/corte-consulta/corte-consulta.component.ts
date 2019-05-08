import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {AuditoriaTendidoService} from '../../services/auditoria-tendido/auditoria-tendido.service';
import {AuditoriaCorteService} from '../../services/auditoria-corte/auditoria-corte.service';
import {ReportesService} from '../../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';

declare var M: any;

@Component({
  selector: 'app-corte-consulta',
  templateUrl: './corte-consulta.component.html',
  styleUrls: ['./corte-consulta.component.css']
})
export class CorteConsultaComponent implements OnInit {
  @ViewChild('modalDetalle', {read: ElementRef}) modalDetalle: ElementRef;

  @Input() set detalleConsulta(value) {
    this.dataSourceWIP = new MatTableDataSource(value);
  }

  dataSourceWIP: MatTableDataSource<any>;
  displayedColumnsWIP: string[] = [
    'Corte', 'Cliente', 'Marca', 'PO', 'Cortadas', 'Fecha Inicio',
    'Fecha fin', 'Defectos', '2das', 'Area', 'Status'
  ];

  dataSourceDetalle: MatTableDataSource<any>;
  displayedColumnsDetalle: string[] = [
    'Serie', 'Bulto', 'Tendido', 'TipoTendido', 'Mesa', 'Posicion', 'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo'];

  displayedColumnsDetalleTendido: string[] = [
    'Cortador', 'Serie', 'Bulto', 'Posicion', 'Defecto',
    'Tolerancia', 'Cantidad', 'Nota', 'Imagen', 'Archivo'
  ];

  otDetalle;

  constructor(private _auditoriaTendidoService: AuditoriaTendidoService,
              private _auditoriaCorteService: AuditoriaCorteService,
              private _reporteService: ReportesService,
              private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  openModalDetalle(auditoria) {
    console.log('Estoy en abrir', auditoria);
    const options = {
      dismissible: true,
      startingTop: '-10%',
      onOpenStart: this.reset.bind(this),
      onCloseEnd: this.closeModalDetalle.bind(this),
    };
    M.Modal.init(this.modalDetalle.nativeElement, options);
    const modalDetalle = M.Modal.getInstance(this.modalDetalle.nativeElement);
    modalDetalle.open();
    if (auditoria.Auditoria === 'CORTE') {
      this._auditoriaCorteService.getAuditoriaDetail(auditoria.IdAuditoria)
        .subscribe((res: any) => {
          res.RES_DET.forEach(
            x => {
              if (x.TipoTendido === 1) {
                x.tipo_tendido = 'Automatico';
              } else if (x.TipoTendido === 2) {
                x.tipo_tendido = 'Manual';
              } else {
                x.tipo_tendido = 'Ambos';
              }
            }
          );
          this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
          this.otDetalle = res.RES;
          console.log(res);
        });
    } else if (auditoria.Auditoria === 'TENDIDO') {
      this._auditoriaTendidoService.getAuditoriaDetail(auditoria.IdAuditoria)
        .subscribe((res: any) => {
          this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
          this.otDetalle = res.RES;
          console.log(res);
        });
    }
  }

  reset() {
    this.dataSourceDetalle = new MatTableDataSource();
  }

  closeModalDetalle() {
    console.log('Estoy en cerrar');
    const modalDetalle = M.Modal.getInstance(this.modalDetalle.nativeElement);
    modalDetalle.destroy();
  }

  getTotalDetalle() {
    if (this.otDetalle.Corte) {
      return this.dataSourceDetalle.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
    } else {
      return this.dataSourceDetalle.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
    }
  }

  imprimirDetalle(auditoria) {
    console.log(auditoria);
    if (auditoria.Corte) {
      this._reporteService.getReporte(auditoria.IdAuditoria, 'Corte')
        .subscribe(
          imprimirResp => {
            console.log('RESULTADO IMPRIMIR RECIB0: ', imprimirResp);
            const pdfResult: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(imprimirResp)
            );
            window.open(pdfResult.changingThisBreaksApplicationSecurity);
            console.log(pdfResult);
          });
    } else if (auditoria.Tendido) {
      this._reporteService.getReporte(auditoria.IdAuditoria, 'Tendido')
        .subscribe(
          imprimirResp => {
            console.log('RESULTADO IMPRIMIR RECIB0: ', imprimirResp);
            const pdfResult: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(imprimirResp)
            );
            window.open(pdfResult.changingThisBreaksApplicationSecurity);
            console.log(pdfResult);
          });
    }
  }

  openPdfInTab(archivo) {
    const base64ImageData = archivo;
    // let extension = this.base64MimeType(archivo);
    // console.log(extension);
    // data:application/pdf
    const contentType = `application/pdf`;

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
  }

  openImage(imagen) {
    const base64ImageData = imagen;
    const extension = this.base64MimeType(imagen);
    console.log(extension);
    const contentType = `image/${extension}`;

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
  }

  base64MimeType(encoded) {
    let result = null;

    if (typeof encoded !== 'string') {
      return result;
    }

    const mime = encoded.match(/data:image+\/([a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  }
}
