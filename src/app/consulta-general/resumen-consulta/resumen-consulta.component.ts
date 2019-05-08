import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-resumen-consulta',
  templateUrl: './resumen-consulta.component.html',
  styleUrls: ['./resumen-consulta.component.css']
})
export class ResumenConsultaComponent implements OnInit {
  dataSourceWIP: MatTableDataSource<any>;
  displayedColumnsWIP: string[] = [
    'Corte', 'Cliente', 'Marca', 'PO', 'POvsEmb',
    'Emb', 'CortevsEmb', 'POvsCorte', 'Cortado',
    'TSeg', 'TFaltantes'
  ];

  constructor() { }

  ngOnInit() {
    $('#lblModulo').text('Consulta general');
  }

}
