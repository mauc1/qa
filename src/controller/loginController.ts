import Usuario from "../model/Usuario";
import { searchUserByEmail, searchStudentByEmail } from "../app/DAO/daoUsuario";
import { useRouter } from "next/navigation";


interface userData {
    email: string;
    password: string;
    rol : string;
    celular : string;
}

class StudentAdapter {
    private student: any;
    constructor(student: any) {
        this.student = student;
    }
    async login(email: string, password: string): Promise<boolean> {
        if (this.student.correo === email && this.student.contrasena === password) {
            return true;
        }
        return false;
    }
}

export const handlerLogin = async (email : string, password : string, router: any, openDialog : any) => {

    // Define the api request to search for the user with the given email and password
    
    let data = await searchUserByEmail(email);
    // convert the data to a json object
    data = JSON.parse(JSON.stringify(data));
    
    

    
    if(data == null){
        data = await searchStudentByEmail(email);
        if (data == null) {
            console.log("Usuario o estudiante no encontrado");
            openDialog();
            return;
        }
        // Autenticar el estudiante
        const studentAdapter = new StudentAdapter(data);
        const isAuthenticated = await studentAdapter.login(email, password);
        if (!isAuthenticated) {
            console.log("Contraseña incorrecta para el estudiante");
            openDialog();
            return;
        }
    } else {
        const user : userData = {
            email: data.correo,
            password: data.contraseña,
            rol: data.rol,
            celular: data.celular
        };

        if(user.password != password){
            console.log("Contraseña incorrecta");
            openDialog();
            return;
        }
    }
    setLocalStorage(data);
    router.push('/mainMenu');

};
  
const setLocalStorage = (data : any) => {
    localStorage.setItem("user", JSON.stringify(data));
}