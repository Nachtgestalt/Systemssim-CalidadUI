import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reportecortegeneral',
  templateUrl: './reportecortegeneral.component.html',
  styleUrls: ['./reportecortegeneral.component.css']
})
export class ReportecortegeneralComponent implements OnInit {
  trustedDashboardUrl: SafeUrl;

  constructor(
    private _toast: ToastrService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    $('.datepicker').datepicker();
    // $('.datepicker').pickadate({
    //   selectMonths: true,
    //   selectYears: 2,
    //   format: 'yyyy-mm-dd'
    // });
    $('#lblModulo').text('Reportes - Wip General');
  }

  ExportaReporte() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Reportes/WipCorte',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (data) {
        if (data.Message.IsSuccessStatusCode) {
          // const request = new XMLHttpRequest();
          // request.open('POST', '', true);
          // request.setRequestHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          // request.responseType = 'arraybuffer';

          // const downloadLink = window.document.createElement('a');
          // tslint:disable-next-line:max-line-length
          // downloadLink.href = window.URL.createObjectURL(new Blob([data.AUD], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
          // downloadLink.download = 'Test.xlsx';
          // document.body.appendChild(downloadLink);
          // downloadLink.click();
          // document.body.removeChild(downloadLink);

          const blob = new Blob([new Uint8Array(data.AUD)], {type: 'application/xls'});
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'WipAuditoria.xls';
          document.body.appendChild(a);
          a.click();

          // const ByteArray = new Uint8Array(data.AUD);
          // tslint:disable-next-line:max-line-length
          // const myExport  = new Blob([data.AUD], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          // const myExport  = new Blob([data.AUD], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          // this.trustedDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(myExport));
          // window.navigator.msSaveOrOpenBlob(myExport, 'test');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

}
