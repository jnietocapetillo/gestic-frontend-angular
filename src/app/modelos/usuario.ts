
export class Usuario {

    //hayUsuario: boolean; //almacenamos si hay o no un usuario logueado, se cambiará por la session de usuario

    idusuario: number; //id del usuario logueado
    password: string; // almacena la password del usuario
    dni: string; //numero de dni
    email: string; //almacena el email del usuario
    idDepartamento:number; //departamento al que pertenece el usuario
    activo:number; // si el usuario esta activo o no
    movil:number; //telefono del usuario
    idPerfil: number; // almacenamos el tipo de usuario 0 - usuario, 1 - administrador, 2 - tecnico
    nombre: string; //nombre y apellido de Usuario
    apellidos:string; //almacena los apellidos del usuario
    domicilio:string;
    localidad:string;
    municipio:string;
    codigo_postal:number;
    avatar:string;
    created_at:Date;
    nombreDepartamento : string;
    nombrePerfil : string;
    hayUsuario : boolean;

    constructor(){
        //this.hayUsuario = true;

        this.idusuario = 0;
        this.password = '';
        this.dni = '';
        this.email = '';
        this.idPerfil = 0;
        this.idDepartamento = 0;
        this.activo = 0;
        this.movil = 0;
        this.nombre = '';    
        this.apellidos = '';
        this.domicilio = '';
        this.municipio = '';
        this.localidad = '';
        this.codigo_postal = 0;
        this.avatar = '';
        this.created_at = new Date();
        this.nombreDepartamento = '';
        this.nombrePerfil = '';
        this.hayUsuario = false;
    }

}