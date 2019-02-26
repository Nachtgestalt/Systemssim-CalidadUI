import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lavanderiaoperaciones',
  templateUrl: './lavanderiaoperaciones.component.html',
  styleUrls: ['./lavanderiaoperaciones.component.css']
})
export class LavanderiaoperacionesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#lblModulo').text('Lavandería - Operaciones');
  }

}
