import Profesor from "@/model/Profesor";
import { addItinerary, getIdItineraryByName, getItineraries } from "../app/DAO/daoItinerario";
import Itinerario from "@/model/Itinerario";

export interface itinerarioData {
    nombre: string;
    autor: Profesor;
}

export const handlerItinerario = async () => {
    let data = await getItineraries();
    data = JSON.parse(JSON.stringify(data));

    let itinerarios: itinerarioData[] = [];
    data.forEach((itinerario: any) => {
        const itinerarioData: itinerarioData = {
            nombre: itinerario.nombre,
            autor: itinerario.autor
        };
        itinerarios.push(itinerarioData);
    }); 
    setLocalStorage(itinerarios);
}

//this func will return a list of itineraries names for visitor
export const handlerItinerarioForVisitor = async () => {
    let data = await getItineraries();
    data = JSON.parse(JSON.stringify(data));

    let itinerarios: itinerarioData[] = [];
    data.forEach((itinerario: any) => {
        const itinerarioData: itinerarioData = {
            nombre: itinerario.nombre,
            autor: itinerario.autor
        };
        itinerarios.push(itinerarioData);
    });
    return itinerarios;
}

//get id of itinerary by name
export const handlerGetIdItineraryByName = async (name: string): Promise<any> => {
    let data = await getIdItineraryByName(name);
    data = JSON.parse(JSON.stringify(data));
    return data;
}

export const handlerAddItinerario = async (nombre: string, autor: string) => {
    await addItinerary(nombre, autor);
    handlerItinerario();
}

//ordenar por nombre
export const sortByName = async () => {
    let data = await getItineraries();
    data = JSON.parse(JSON.stringify(data));

    let itinerarios: itinerarioData[] = [];
    data.forEach((itinerario: any) => {
        const itinerarioData: itinerarioData = {
            nombre: itinerario.nombre,
            autor: itinerario.autor
        };
        itinerarios.push(itinerarioData);
    });
    itinerarios.sort((a, b) => {
        return a.nombre.localeCompare(b.nombre);
    });
    setLocalStorage(itinerarios);
}

//ordenar por autor
export const sortByAuthor = async () => {
    let data = await getItineraries();
    data = JSON.parse(JSON.stringify(data));

    let itinerarios: itinerarioData[] = [];
    data.forEach((itinerario: any) => {
        const itinerarioData: itinerarioData = {
            nombre: itinerario.nombre,
            autor: itinerario.autor
        };
        itinerarios.push(itinerarioData);
    });
    itinerarios.sort((a, b) => {
        return a.autor.toString().localeCompare(b.autor.toString());
    });
    setLocalStorage(itinerarios);
}

//search by name
export const searchItineraryByName = async (nombre: string) => {
    let data = await getItineraries();
    data = JSON.parse(JSON.stringify(data));
    
    let itinerarios: itinerarioData[] = [];
    data.forEach((itinerario: any) => {
        const itinerarioData: itinerarioData = {
            nombre: itinerario.nombre,
            autor: itinerario.autor
        };
        itinerarios.push(itinerarioData);
    });
    //buscar sin importar si es lowercase o uppercase
    itinerarios = itinerarios.filter((itinerario) => itinerario.nombre.toLowerCase().includes(nombre.toLowerCase()));
    setLocalStorage(itinerarios);
    return itinerarios[0].nombre;
}

//search id by name
export const searchIdItineraryByName = async (nombre: string) => {
    let data = await getIdItineraryByName(nombre);
    const id = JSON.parse(JSON.stringify(data));
    return id;
}

const setLocalStorage = (itinerario: itinerarioData[]) => {
    localStorage.setItem("itinerario", JSON.stringify(itinerario));
}

