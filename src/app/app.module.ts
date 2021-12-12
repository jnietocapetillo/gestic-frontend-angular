import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
<<<<<<< Updated upstream
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { PieDePaginaComponent } from './pie-de-pagina/pie-de-pagina.component';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { LoginComponent } from './login/login.component';
import { UsuarioService } from './servicios/usuario.service';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';
import { DetalleIncidenciaComponent } from './detalle-incidencia/detalle-incidencia.component';
import { LogsComponent } from './logs/logs.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { IncidenciaService } from './servicios/incidencia.service';
import { UpdateIncidenciaComponent } from './update-incidencia/update-incidencia.component';
import { UpdateUsuarioComponent } from './update-usuario/update-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AgregarUsuarioComponent } from './agregar-usuario/agregar-usuario.component';
import { AgregarIncidenciaComponent } from './agregar-incidencia/agregar-incidencia.component';
import { AsignarIncidenciaComponent } from './asignar-incidencia/asignar-incidencia.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MensajeriaComponent } from './mensajeria/mensajeria.component';
import { DetalleMensajeComponent } from './detalle-mensaje/detalle-mensaje.component';
import { AsignarTecnicoComponent } from './asignar-tecnico/asignar-tecnico.component';
import { EmailComponent } from './email/email.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IncidenciasAsignadasComponent } from './incidencias-asignadas/incidencias-asignadas.component';
import { DetalleUsuarioAdminComponent } from './detalle-usuario-admin/detalle-usuario-admin.component';
import { DesactivarUsuarioComponent } from './desactivar-usuario/desactivar-usuario.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider} from 'angularx-social-login';
import { LogsService } from './servicios/logs.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MensajeService } from './servicios/mensaje.service';
import { EnviosEmailService } from './servicios/envios-email.service';
import { LoginServiceService } from './servicios/login-service.service';
import { RecodarPasswordComponent } from './recodar-password/recodar-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ContactoComponent } from './contacto/contacto.component';


@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    PieDePaginaComponent,
    EscritorioComponent,
    LoginComponent,
    IncidenciasComponent,
    DetalleUsuarioComponent,
    DetalleIncidenciaComponent,
    LogsComponent,
    UsuariosComponent,
    UpdateIncidenciaComponent,
    UpdateUsuarioComponent,
    ResetPasswordComponent,
    AgregarUsuarioComponent,
    AgregarIncidenciaComponent,
    AsignarIncidenciaComponent,
    MensajeriaComponent,
    DetalleMensajeComponent,
    AsignarTecnicoComponent,
    EmailComponent,
    ConfiguracionComponent,
    DepartamentosComponent,
    PerfilesComponent,
    IncidenciasAsignadasComponent,
    DetalleUsuarioAdminComponent,
    DesactivarUsuarioComponent,
    RecodarPasswordComponent,
    PageNotFoundComponent,
    ContactoComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    CKEditorModule,
    SocialLoginModule
  ],
  providers: [
    UsuarioService,
    IncidenciaService,
    LogsService,
    MensajeService,
    EnviosEmailService,
    LoginServiceService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '936200072728-28v3iveqir1knucrhffeabrlrdebm5hp.apps.googleusercontent.com'
            )
          },
        ]
      } as SocialAuthServiceConfig,
    }
  ],
=======

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
>>>>>>> Stashed changes
  bootstrap: [AppComponent]
})
export class AppModule { }
