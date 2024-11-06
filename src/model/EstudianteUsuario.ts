
class EstudianteUsuario {
    private _carne: string;
    private _nombre: string;
    private _primerApellido: string;
    private _segundoApellido: string;
    private _correo: string;
    private _celular: string;
    private _sede: string;
    private _contrasena: string;
    private _rol: string;
    private _estado: string;
    private _fotoPerfil: string;

    constructor(carne: string, nombre: string, primerApellido: string, segundoApellido: string, correo: string, celular: string, sede: string, contrasena:string, rol: string, estado: string, fotoPerfil: string) {
        this._carne = carne;
        this._nombre = nombre;
        this._primerApellido = primerApellido;
        this._segundoApellido = segundoApellido;
        this._correo = correo;
        this._celular = celular;
        this._sede = sede;
        this._contrasena = contrasena;
        this._rol = rol;
        this._estado = estado;
        this._fotoPerfil = fotoPerfil;
    }
     // Getters

    get carne() {
        return this._carne;
    }

    get nombre() {
        return this._nombre;
    }

    get primerApellido() {
        return this._primerApellido;
    }

    get segundoApellido() {
        return this._segundoApellido;
    }
     get correo() {
        return this._correo;
    }

    get celular() {
        return this._celular;
    }

    get sede() {
        return this._sede;
    }

    get contrasena() {
        return this._contrasena;
    }

    get estado() {
        return this._estado;
    }

    get rol() {
        return this._rol;
    }

    get foto() {
        return this._fotoPerfil;
    }
}
export default EstudianteUsuario;