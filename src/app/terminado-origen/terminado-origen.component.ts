import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminado-origen',
  templateUrl: './terminado-origen.component.html',
  styleUrls: ['./terminado-origen.component.css']
})
export class TerminadoOrigenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#lblModulo').text('Terminado - Origen');
  }

}
