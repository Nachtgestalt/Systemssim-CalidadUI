import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {AuditoriaTerminadoService} from '../../services/terminado/auditoria-terminado.service';
import {ReportesService} from '../../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';

declare var M: any;

@Component({
  selector: 'app-terminado-consulta',
  templateUrl: './terminado-consulta.component.html',
  styleUrls: ['./terminado-consulta.component.css']
})
export class TerminadoConsultaComponent implements OnInit {
  @ViewChild('modalDetalle', {read: ElementRef}) modalDetalle: ElementRef;

  @Input() set detalleConsulta(value) {
    this.dataSourceWIP = new MatTableDataSource(value);
  }

  dataSourceWIP: MatTableDataSource<any>;
  displayedColumnsWIP: string[] = [
    'Corte', 'Cliente', 'Marca', 'PO', 'Fecha Inicio',
    'Fecha fin', 'Defectos', 'Composturas', 'Status'
  ];

  dataSourceDetalle: MatTableDataSource<any>;
  displayedColumnsDetalle: string[] = [
    'Defecto', 'Operacion', 'Posicion', 'Origen', 'Cantidad', 'Imagen', 'Nota'];

  otDetalle;
  tipoDetalleAud = '';
  tituloModalDetalle = '';
  totalDetalle;

  constructor(private _terminadoAuditoriaService: AuditoriaTerminadoService,
              private _reporteService: ReportesService,
              private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  openModalDetalle(auditoria, tipo) {
    this.tipoDetalleAud = tipo;
    this.tituloModalDetalle = tipo.toUpperCase();
    const modalDetalle = document.querySelector('#modal-detalle');
    M.Modal.init(modalDetalle);
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.open();
    this.totalDetalle = auditoria.total;

    this._terminadoAuditoriaService.getAuditoriaDetail(auditoria.IdAuditoria, tipo)
      .subscribe((res: any) => {
        this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
        this.otDetalle = res.RES;
        console.log(res);
      });
  }

  closeModalDetalle() {
    const modalDetalle = document.querySelector('#modal-detalle');
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.close();
  }

  imprimirDetalle(auditoria) {
    console.log(auditoria);
    this._reporteService.getReporte(auditoria.IdAuditoria, 'Terminado', this.tipoDetalleAud)
      .subscribe(
        imprimirResp => {
          console.log('RESULTADO IMPRIMIR RECIB0: ', imprimirResp);
          const pdfResult: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp)
          );
          // printJS(pdfResult.changingThisBreaksApplicationSecurity);
          window.open(pdfResult.changingThisBreaksApplicationSecurity);
          console.log(pdfResult);
        });
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
