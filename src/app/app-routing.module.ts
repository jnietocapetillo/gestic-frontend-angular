import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarIncidenciaComponent } from './agregar-incidencia/agregar-incidencia.component';
import { AgregarUsuarioComponent } from './agregar-usuario/agregar-usuario.component';
import { AsignarIncidenciaComponent } from './asignar-incidencia/asignar-incidencia.component';
import { AsignarTecnicoComponent } from './asignar-tecnico/asignar-tecnico.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { ContactoComponent } from './contacto/contacto.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { DesactivarUsuarioComponent } from './desactivar-usuario/desactivar-usuario.component';
import { DetalleIncidenciaComponent } from './detalle-incidencia/detalle-incidencia.component';
import { DetalleMensajeComponent } from './detalle-mensaje/detalle-mensaje.component';
import { DetalleUsuarioAdminComponent } from './detalle-usuario-admin/detalle-usuario-admin.component';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';
import { EmailComponent } from './email/email.component';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { IncidenciasAsignadasComponent } from './incidencias-asignadas/incidencias-asignadas.component';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { LoginComponent } from './login/login.component';
import { LogsComponent } from './logs/logs.component';
import { MensajeriaComponent } from './mensajeria/mensajeria.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RecodarPasswordComponent } from './recodar-password/recodar-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdateIncidenciaComponent } from './update-incidencia/update-incidencia.component';
import { UpdateUsuarioComponent } from './update-usuario/update-usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  {
    path:'', component:LoginComponent
  },
  {
    path:'escritorio', component:EscritorioComponent
  },
  {
    path:'reset', component: ResetPasswordComponent
  },
  {
    path:'recordar', component: RecodarPasswordComponent
  },
  {
    path:'usuario/add', component:AgregarUsuarioComponent
  },
  {
    path:'usuarios',component:UsuariosComponent
  },
  {
    path:'usuario/detalle',component:DetalleUsuarioComponent
  },
  {
    path:'usuario/details/:id', component: DetalleUsuarioAdminComponent
  },
  {
    path:'usuario/desactivar', component: DesactivarUsuarioComponent
  },
  {
    path:'usuario/actualizar',component:UpdateUsuarioComponent
  },
  {
    path:'incidencia/detalle/:id', component:DetalleIncidenciaComponent
  },
  {
    path: 'incidencia/asignar/:id', component:AsignarIncidenciaComponent
  },
  {
    path: 'incidencia/actualizar/:id', component: UpdateIncidenciaComponent
  },
  {
    path:'incidencias', component:IncidenciasComponent
  },
  {
    path:'addincidencia', component:AgregarIncidenciaComponent
  },
  {
    path:'mensaje/incidencia/:id', component: MensajeriaComponent
  },
  {
    path:'detalle-mensaje/:id', component: DetalleMensajeComponent
  },
  {
    path:'incidencia/asignarTecnico/:id', component: AsignarTecnicoComponent
  },
  {
    path:'incidencias/asignadas', component : IncidenciasAsignadasComponent
  },
  {
    path:'email', component:EmailComponent
  },
  {
    path: 'departamentos', component: DepartamentosComponent
  },
  {
    path: 'perfiles', component: PerfilesComponent
  },
  {
    path: 'logs', component: LogsComponent
  },
  {
    path: 'contacto', component: ContactoComponent
  },
  {
    path: '**', component: PageNotFoundComponent
  }


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
