import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ClientesService} from '../services/clientes/clientes.service';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {ToastrService} from 'ngx-toastr';
import {switchMap} from 'rxjs/operators';

declare var M: any;

@Component({
  selector: 'app-marca-cliente',
  templateUrl: './marca-cliente.component.html',
  styleUrls: ['./marca-cliente.component.css']
})
export class MarcaClienteComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  displayedColumns: string[] = ['select', 'clase', 'nombre'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  clientes = [];

  idClienteRef;

  constructor(private _clientesService: ClientesService,
              private _toast: ToastrService,) {

  }

  ngOnInit() {
    this.dtOptions = {
      language: {
        // pageLength: 6,
        processing: 'Procesando...',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ elementos',
        info: '_START_ - _END_ de _TOTAL_ elementos',
        infoEmpty: 'Mostrando ningún elemento.',
        infoFiltered: '(filtrado _MAX_ elementos total)',
        infoPostFix: '',
        loadingRecords: 'Cargando registros...',
        zeroRecords: 'No se encontraron registros',
        emptyTable: 'No hay datos disponibles en la tabla',
        paginate: {
          first: 'Primero',
          previous: 'Anterior',
          next: 'Siguiente',
          last: 'Último'
        },
      }
    };
    $('#lblModulo').text('Catálogo - Relación Marca-Cliente');
    this.obtenerClientes();
    const modalMarca = document.querySelector('#modalMarcas');
    const instance = M.Modal.init(modalMarca, {});
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  obtenerClientes() {
    this._clientesService.listClientes()
      .subscribe(
        (res: Array<any>) => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.clientes = res;
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        }
      );
  }

  obtenerMarcas(modal, cliente) {
    this.idClienteRef = cliente.IdClienteRef;
    // if ( accion === 'nuevo') {
      this._clientesService.listClienteMarcas()
        .pipe(
          switchMap( (res: any) => {
            this.dataSource = new MatTableDataSource<any>(res.Marcas);
            return this._clientesService.getClienteMarca(this.idClienteRef);
          })
        )
        .subscribe(
          (res: any) => {
            console.log(res);
            let marcas = res.Marcas;
            let copyDataSourceEdit = [];
            this.dataSource.data.forEach( (x, i) => {
              marcas.forEach( y => {
                if ( y.Clave === x.Clave ) {
                  copyDataSourceEdit.push(x);
                }
              });
            });
            console.log('Seleccion: ', copyDataSourceEdit);
            this.selection = new SelectionModel(true, copyDataSourceEdit);
            // this.dataSource = new MatTableDataSource<any>(res.Marcas);
          }
        );
    // }
    // if (accion === 'editar') {
    //   this._clientesService.getClienteMarca(this.idClienteRef)
    //     .subscribe(
    //       (res: any) => {
    //         this.dataSource = new MatTableDataSource(res.Marcas);
    //         this.selection = new SelectionModel(true, this.dataSource.data);
    //       }
    //     );
    // }
    const instance = M.Modal.getInstance(modal);
    instance.open();
  }

  guardar(modal) {
    const body = {
      IdClienteRef: `${this.idClienteRef}`,
      Marcas: this.selection.selected
    };
    this._clientesService.createClienteMarcas(body)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se creo con exito la relación Marca-Cliente', '');
            const instance = M.Modal.getInstance(modal);
            instance.close();
          }
        }
      );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
