export class Incidencia{
    idincidencia: number;
    idusuario: number;
    tecnico_asignado: number;
    fecha: Date;
    prioridad: number;
    estado: string;
    titulo: string;
    departamento: string;
    descripcion: string;
    imagen: string;

    constructor(){
        this.idincidencia = 0;
        this.idusuario = 0;
        this.tecnico_asignado = 11;
        this.fecha = new Date();
        this.prioridad = -1;
        this.estado = '';
        this.titulo = '';
        this.departamento = '';
        this.descripcion = '';
        this.imagen = '';
    }
}