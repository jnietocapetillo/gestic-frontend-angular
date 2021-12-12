export class Mensaje{
    idmensaje : number;
    idusuario: number;
    idusuario_receptor: number;
    idusuario_origen: number;
    idincidencia : number;
    fecha : Date;
    descripcion : string;
    leido : number;
    imagen : string;
    nombre_origen : string;

    constructor()
    {
        this.idmensaje = 0;
        this.idusuario = 0;
        this.idincidencia = 0;
        this.idusuario_receptor =0;
        this.idusuario_origen = 0;
        this.fecha = new Date();
        this.descripcion = '';
        this.imagen = '';
        this.leido = 0;
        this.nombre_origen = '';
    }
}