import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {ReportesService} from '../../services/reportes/reportes.service';
import {AuditoriaConfeccionService} from '../../services/auditoria-confeccion/auditoria-confeccion.service';
import {DomSanitizer} from '@angular/platform-browser';

declare var M: any;

@Component({
  selector: 'app-confeccion-consulta',
  templateUrl: './confeccion-consulta.component.html',
  styleUrls: ['./confeccion-consulta.component.css']
})
export class ConfeccionConsultaComponent implements OnInit {
  @ViewChild('modalDetalle', {read: ElementRef}) modalDetalle: ElementRef;

  @Input() set detalleConsulta(value) {
    this.dataSourceWIP = new MatTableDataSource(value);
  }

  dataSourceWIP: MatTableDataSource<any>;
  displayedColumnsWIP: string[] = [
    'Corte', 'Cliente', 'Marca', 'PO', 'Planta', 'Fecha Inicio',
    'Fecha fin', 'Defectos', 'Composturas', 'Status'
  ];

  dataSourceDetalle: MatTableDataSource<any>;
  displayedColumnsDetalle: string[] = [
    'Area', 'Operacion', 'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo'];

  otDetalle;

  constructor(private _reporteService: ReportesService,
              private _auditoriaConfeccionService: AuditoriaConfeccionService,
              private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  openModalDetalle(auditoria) {
    console.log('Estoy en abrir');
    const options = {
      dismissible: true,
      startingTop: '-10%',
      onOpenStart: this.reset.bind(this),
      onCloseEnd: this.closeModalDetalle.bind(this),
    };
    M.Modal.init(this.modalDetalle.nativeElement, options);
    const modalDetalle = M.Modal.getInstance(this.modalDetalle.nativeElement);
    modalDetalle.open();

    this._auditoriaConfeccionService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
        this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
        this.otDetalle = res.RES;
        console.log(res);
      });
  }

  closeModalDetalle() {
    console.log('Estoy en cerrar');
    const modalDetalle = M.Modal.getInstance(this.modalDetalle.nativeElement);
    modalDetalle.destroy();
  }

  imprimirDetalle(auditoria) {
    console.log(auditoria);
    this._reporteService.getReporte(auditoria.IdAuditoria, 'Confeccion')
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

  reset() {
    this.dataSourceDetalle = new MatTableDataSource();
  }

  getTotalDetalle() {
    return this.dataSourceDetalle.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
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
