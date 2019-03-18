import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {DataTablesModule} from 'angular-datatables';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {Globals} from './Globals';
import {ToastrModule} from 'ngx-toastr';
import {LaddaModule} from 'angular2-ladda';
import {NavmenuComponent} from './navmenu/navmenu.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {UsuariosComponent} from './usuarios/usuarios.component';
import {ClientesComponent} from './clientes/clientes.component';
import {CorreoselectronicosComponent} from './correoselectronicos/correoselectronicos.component';
import {CorteComponent} from './corte/corte.component';
import {SegundasComponent} from './segundas/segundas.component';
import {TendidoComponent} from './tendido/tendido.component';
import {TipotendidoComponent} from './tipotendido/tipotendido.component';
import {MesaComponent} from './mesa/mesa.component';
import {DefectocorteComponent} from './defectocorte/defectocorte.component';
import {DefectoconfeccionComponent} from './defectoconfeccion/defectoconfeccion.component';
import {PosicioncorteComponent} from './posicioncorte/posicioncorte.component';
import {OperacionconfeccionComponent} from './operacionconfeccion/operacionconfeccion.component';
import {AreaconfeccionComponent} from './areaconfeccion/areaconfeccion.component';
import {PlantasComponent} from './plantas/plantas.component';
import {ProcesosespecialesdefectosComponent} from './procesosespecialesdefectos/procesosespecialesdefectos.component';
import {LavanderiadefectosComponent} from './lavanderiadefectos/lavanderiadefectos.component';
import {LavanderiaposicionComponent} from './lavanderiaposicion/lavanderiaposicion.component';
import {LavanderiaoperacionesComponent} from './lavanderiaoperaciones/lavanderiaoperaciones.component';
import {TerminadodefectosComponent} from './terminadodefectos/terminadodefectos.component';
import {ProcesosespecialesoperacionesComponent} from './procesosespecialesoperaciones/procesosespecialesoperaciones.component';
import {ProcesosespecialesposicionComponent} from './procesosespecialesposicion/procesosespecialesposicion.component';
import {ToleranciacorteComponent} from './toleranciacorte/toleranciacorte.component';
import {AuditoriacorteComponent} from './auditoriacorte/auditoriacorte.component';
import {AuditoriatendidoComponent} from './auditoriatendido/auditoriatendido.component';
import {AuditoriaconfeccionComponent} from './auditoriaconfeccion/auditoriaconfeccion.component';
import {AuditoriaprocesosespecialesComponent} from './auditoriaprocesosespeciales/auditoriaprocesosespeciales.component';
import {ReportecortegeneralComponent} from './reportecortegeneral/reportecortegeneral.component';
import {CatalogPageComponent} from './pages/catalog-page/catalog-page.component';
import {CutPageComponent} from './pages/cut-page/cut-page.component';
import {ConfectionPageComponent} from './pages/confection-page/confection-page.component';
import {GeneralPageComponent} from './pages/general-page/general-page.component';
import {ProcessesAndLaundryPageComponent} from './pages/processes-and-laundry-page/processes-and-laundry-page.component';
import {ReportsPageComponent} from './pages/reports-page/reports-page.component';
import {FinishedPageComponent} from './pages/finished-page/finished-page.component';
import {AdminPageComponent} from './pages/admin-page/admin-page.component';
import {TerminadoOperacionesComponent} from './terminado-operaciones/terminado-operaciones.component';
import {TerminadoPosicionComponent} from './terminado-posicion/terminado-posicion.component';
import {TerminadoOrigenComponent} from './terminado-origen/terminado-origen.component';
import {TerminadoAudiotoriaDefectosComponent} from './terminado-audiotoria-defectos/terminado-audiotoria-defectos.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CargaImagenesComponent} from './components/carga-imagenes/carga-imagenes.component';
import {NgDropFilesDirective} from './directives/ng-drop-files.directive';
import {EliminarComponent} from './dialogs/eliminar/eliminar.component';
import {MaterialModule} from './material/material.module';
import {AddEditOperacionTerminadoComponent} from './terminado-operaciones/add-edit-operacion-terminado/add-edit-operacion-terminado.component';
import { NumberPipePipe } from './pipes/number-pipe.pipe';
import { QualityPageComponent } from './pages/quality-page/quality-page.component';
import { CalidadAuditoriaComponent } from './calidad-auditoria/calidad-auditoria.component';
import { CalidadConsultaAuditoriaComponent } from './calidad-consulta-auditoria/calidad-consulta-auditoria.component';

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    LoginComponent,
    HomeComponent,
    UsuariosComponent,
    ClientesComponent,
    CorreoselectronicosComponent,
    CorteComponent,
    TendidoComponent,
    TipotendidoComponent,
    MesaComponent,
    DefectocorteComponent,
    DefectoconfeccionComponent,
    PosicioncorteComponent,
    OperacionconfeccionComponent,
    AreaconfeccionComponent,
    SegundasComponent,
    PlantasComponent,
    ProcesosespecialesdefectosComponent,
    LavanderiadefectosComponent,
    LavanderiaoperacionesComponent,
    LavanderiaposicionComponent,
    TerminadodefectosComponent,
    ProcesosespecialesoperacionesComponent,
    ProcesosespecialesposicionComponent,
    ToleranciacorteComponent,
    AuditoriacorteComponent,
    AuditoriatendidoComponent,
    AuditoriaconfeccionComponent,
    AuditoriaprocesosespecialesComponent,
    ReportecortegeneralComponent,
    CatalogPageComponent,
    CutPageComponent,
    ConfectionPageComponent,
    GeneralPageComponent,
    ProcessesAndLaundryPageComponent,
    ReportsPageComponent,
    FinishedPageComponent,
    AdminPageComponent,
    TerminadoOperacionesComponent,
    TerminadoPosicionComponent,
    TerminadoOrigenComponent,
    TerminadoAudiotoriaDefectosComponent,
    CargaImagenesComponent,
    NgDropFilesDirective,
    EliminarComponent,
    AddEditOperacionTerminadoComponent,
    NumberPipePipe,
    QualityPageComponent,
    CalidadAuditoriaComponent,
    CalidadConsultaAuditoriaComponent,
  ],
  entryComponents: [
    AddEditOperacionTerminadoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    DataTablesModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    RouterModule.forRoot([
      {path: 'navmenu', component: NavmenuComponent},
      {path: 'login', component: LoginComponent},
      {path: 'home', component: HomeComponent},
      {
        path: 'admin', component: AdminPageComponent, children: [
          {path: '', redirectTo: 'usuarios', pathMatch: 'full'},
          {path: 'usuarios', component: UsuariosComponent}
        ]
      },
      {
        path: 'catalog', component: CatalogPageComponent, children: [
          {path: '', redirectTo: 'clientes', pathMatch: 'full'},
          {path: 'clientes', component: ClientesComponent},
          {path: 'correoselectronicos', component: CorreoselectronicosComponent},
          {path: 'segundas', component: SegundasComponent}
        ]
      },
      {
        path: 'cut', component: CutPageComponent, children: [
          {path: '', redirectTo: 'corte', pathMatch: 'full'},
          {path: 'corte', component: CorteComponent},
          {path: 'defectocorte', component: DefectocorteComponent},
          {path: 'mesa', component: MesaComponent},
          {path: 'posicioncorte', component: PosicioncorteComponent},
          {path: 'tendido', component: TendidoComponent},
          {path: 'tipotendido', component: TipotendidoComponent},
          {path: 'toleranciacorte', component: ToleranciacorteComponent},
          {path: 'auditoriacorte', component: AuditoriacorteComponent},
          {path: 'auditoriatendido', component: AuditoriatendidoComponent}
        ]
      },
      {
        path: 'confection', component: ConfectionPageComponent, children: [
          {path: '', redirectTo: 'areaconfeccion', pathMatch: 'full'},
          {path: 'areaconfeccion', component: AreaconfeccionComponent},
          {path: 'defectoconfeccion', component: DefectoconfeccionComponent},
          {path: 'operacionconfeccion', component: OperacionconfeccionComponent},
          {path: 'plantas', component: PlantasComponent},
          {path: 'auditoriaconfeccion', component: AuditoriaconfeccionComponent}
        ]
      },
      {
        path: 'general', component: GeneralPageComponent, children: []
      },
      {
        path: 'processes-and-laundry', component: ProcessesAndLaundryPageComponent, children: [
          {path: '', redirectTo: 'lavanderiadefectos', pathMatch: 'full'},
          {path: 'lavanderiadefectos', component: LavanderiadefectosComponent},
          {path: 'lavanderiaoperaciones', component: LavanderiaoperacionesComponent},
          {path: 'lavanderiaposicion', component: LavanderiaposicionComponent},
          {path: 'procesosespecialesdefectos', component: ProcesosespecialesdefectosComponent},
          {path: 'procesosespecialesoperaciones', component: ProcesosespecialesoperacionesComponent},
          {path: 'procesosespecialesposicion', component: ProcesosespecialesposicionComponent},
          {path: 'auditoriaprocesosespeciales', component: AuditoriaprocesosespecialesComponent},
        ]
      },
      {
        path: 'reports', component: ReportsPageComponent, children: [
          {path: '', redirectTo: 'reportecortegeneral', pathMatch: 'full'},
          {path: 'reportecortegeneral', component: ReportecortegeneralComponent}
        ]
      },
      {
        path: 'finished', component: FinishedPageComponent, children: [
          {path: '', redirectTo: 'terminado-operaciones', pathMatch: 'full'},
          {path: 'terminadodefectos', component: TerminadodefectosComponent},
          {path: 'terminado-operaciones', component: TerminadoOperacionesComponent},
          {path: 'terminado-posicion', component: TerminadoPosicionComponent},
          {path: 'terminado-origen', component: TerminadoOrigenComponent},
          {path: 'terminado-auditoria-defectos', component: TerminadoAudiotoriaDefectosComponent},
        ]
      },
      {
        path: 'quality', component: QualityPageComponent, children: [
          {path: '', redirectTo: 'calidad-operaciones', pathMatch: 'full'},
          {path: 'calidad-defectos', component: TerminadodefectosComponent},
          {path: 'calidad-operaciones', component: TerminadoOperacionesComponent},
          {path: 'calidad-posicion', component: TerminadoPosicionComponent},
          {path: 'calidad-origen', component: TerminadoOrigenComponent},
          {path: 'calidad-auditoria-registro', component: CalidadAuditoriaComponent},
          {path: 'calidad-auditoria-consulta', component: CalidadConsultaAuditoriaComponent},
        ]
      },
      {path: '**', redirectTo: ''}
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
