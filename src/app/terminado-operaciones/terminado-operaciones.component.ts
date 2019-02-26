import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminado-operaciones',
  templateUrl: './terminado-operaciones.component.html',
  styleUrls: ['./terminado-operaciones.component.css']
})
export class TerminadoOperacionesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#lblModulo').text('Terminado - Operaciones');
  }

}
