import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { archivo } from '../modelos/archivo';
import { Departamento } from '../modelos/departamento';
import { responseUpdate } from '../modelos/responseUpdate';
import { UsuarioService } from '../servicios/usuario.service';


@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css']
})
export class UpdateUsuarioComponent implements OnInit {
  archivo : archivo = new archivo();
  nombreDepartamento : string = '';
  respuestaApiUpdate: responseUpdate = new responseUpdate();
  resultado:number = 0;
  departamentos : Array<Departamento> = new Array<Departamento>();
  rutaImagen : string = 'http://gestic/storage/'+this.usuarioInyectado.usuario.avatar;

  formUsuarioUpdate = this.formBuilder.group({
    idusuario:[this.usuarioInyectado.usuario.idusuario],
    nombre:[this.usuarioInyectado.usuario.nombre, [Validators.required, Validators.pattern(/[a-zA-Z]{1,30}/)]],
    apellidos: [this.usuarioInyectado.usuario.apellidos, [Validators.required, Validators.pattern(/[a-zA-Z]{1,30}/)]],                                                      
    dni: [this.usuarioInyectado.usuario.dni, [Validators.required, Validators.pattern(/(\d{8})([-]?)([a-zA-Z]{1})/)]],
    correo: [this.usuarioInyectado.usuario.email,[Validators.required, Validators.pattern(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/)]],
    departamento:[''],
    movil: [this.usuarioInyectado.usuario.movil, [Validators.pattern(/[9|6]{1}([\d]{2}[-]*){3}[\d]{2}/)]],
    domicilio: [this.usuarioInyectado.usuario.domicilio],
    municipio: [this.usuarioInyectado.usuario.municipio],
    localidad: [this.usuarioInyectado.usuario.localidad],
    codigo_postal: [this.usuarioInyectado.usuario.codigo_postal,[Validators.pattern(/(([1-4][0-9][0-9][0-9][0-9])|(0(?=[1-9][0-9][0-9][0-9]))|(5(?=[0-2][0-9][0-9][0-9])))/)]],
    imagen: [this.usuarioInyectado.usuario.avatar]
  });
  

  constructor(public usuarioInyectado: UsuarioService, private formBuilder: FormBuilder) { 
    
  }

  ngOnInit(): void {
    this.usuarioInyectado.departamentoUsuario(this.usuarioInyectado.usuario.idDepartamento).subscribe((datoDevuelto =>{
        this.formUsuarioUpdate.controls['departamento'].setValue(datoDevuelto);
    }));

    this.usuarioInyectado.departamentosUsuarios().subscribe((datosDevueltos =>{
        this.departamentos = datosDevueltos;
        
    }));
    console.log(this.usuarioInyectado.usuario.avatar);
    
  }

    /**
     * Funcion que coge los datos del formulario y los envia para actualizar los datos
     */
  datosActualizados()
  {
     const datosUsuarios = this.formUsuarioUpdate.value;

      this.usuarioInyectado.updateUsuario(datosUsuarios).subscribe((datosDevueltos =>{
            if (datosDevueltos.estado == 200 ){
              this.respuestaApiUpdate.estado = datosDevueltos.estado;
              this.respuestaApiUpdate.datos = datosDevueltos.datos;
              this.usuarioInyectado.usuario = this.respuestaApiUpdate.datos;

              //se ha actualizado el usuario, vemos si se ha seleccionado una imagen
                if (this.archivo.nombreArchivo != '')
                {
                  this.usuarioInyectado.addImagenUsuario(this.archivo).subscribe((datosDevueltos => {
                      if (datosDevueltos == 200)
                      {
                        Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: 'Se ha guardado el mensaje',
                              showConfirmButton: true,
                            });
                      }
                      else      
                      {
                          Swal.fire({
                                title: 'Error!',
                                text: 'No se ha podido guardar la imagen',
                                icon: 'error',
                                confirmButtonText: 'OK'
                          });
                      }
                  }));
                }
            }
                
            this.resultado=datosDevueltos.estado;
            this.mostrarAlerta();
        }));
  }

  mostrarAlerta()
  {
    if (this.resultado == 200)
    {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha actualizado el Usuario',
            showConfirmButton: true,
          });
        
    }
    else
    {
        Swal.fire({
            title: 'Error!',
            text: 'No se ha podido actualizar los datos',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
  }

  /**
   * funcion que extrae del evento la informacion del fichero seleccionado
   * @param event 
   */
  subirImagen(event: any)
  {
    var files = event.target.files;
    var file = files[0];
    this.archivo.nombreArchivo = file.name;

    if (files && file)
    {
      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);

    }
  }

  /**
   * funcion que guarda los datos del fichero
   * @param readerEvent 
   */
  handleReaderLoaded(readerEvent: any)
  {
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }

}
