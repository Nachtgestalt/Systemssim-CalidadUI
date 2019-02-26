import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminado-audiotoria-defectos',
  templateUrl: './terminado-audiotoria-defectos.component.html',
  styleUrls: ['./terminado-audiotoria-defectos.component.css']
})
export class TerminadoAudiotoriaDefectosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#lblModulo').text('Terminado - Auditoría defectos');
  }

}
