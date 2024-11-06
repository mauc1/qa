import Profesor from "@/model/Profesor";
import { getNextActivity, addActivity, uploadFilePoster, deleteAct, getActivitiesIt, editActivity, getAllActivities, editStateActivity } from "../app/DAO/daoActividad";
import Comentario from "@/model/Comentario";
import Prueba from "@/model/Prueba"; 
import { TipoActividad } from "@/model/TipoActividad";
import { act } from "react-dom/test-utils";
import Actividad from "@/model/Actividad";
import { Visitor } from "@/app/visitor/Visitor";
import { ActivityVisitor } from "@/app/visitor/ActivityVisitor";
import Itinerario from "@/model/Itinerario";
import { itinerarioData } from "./ItinerarioController";


export interface activityData extends ActivityVisitor {
    id: string;
    nombre: string;
    estado: string;
    fecha: Date;
    iniciarRecordatorio: string;
    frecuencia: number;
    hora: string;
    accept: (itinerary: itinerarioData, visitor: Visitor, localTime: Date) => void;
}

interface activityDataPrueba {
    nombre: string;
    semanaRealizacion: number;
    tipo: string;
    modalidad: string;
    fecha: string;
    hora: string;
    iniciarRecordatorio: string;
    enlace: string;
    afiche: string;
    encargados: Profesor[];

}

interface activitiesItData {
    id: string;
    semanaRealizacion: number;
    nombre: string;
    estado: string;
}

export const handlerAllActivities = async () => {
    try {
        const data: Actividad[] = await getAllActivities();
        if (!data || data.length === 0) {
            console.log("No hay actividades");
            return [];
        } 
        return data;
    } catch (error) {
        console.error("Error al cargar actividades:", error);
        return [];
    }
}

export const handlerNextActivity = async () => {
    try {
        const data = await getNextActivity();
        if (!data || data.length === 0) {
            console.log("No hay actividades");
            return null;
        } 
        // Ordenar
        data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        const now = new Date();
        // Encuentra próxima actividad
        const nextActivity = data.find(activity => 
            new Date(activity.fecha).getTime() > now.getTime() && 
            (activity.estado == "Planeada" || activity.estado == "Notificada")
        );
        return nextActivity || null;
    } catch (error) {
        console.error("Error al cargar proxima actividad:", error);
        return null;
    }
}

export const handlerActivitiesIt = async (idIt: string) => {
    let data = await getActivitiesIt(idIt);
    data = JSON.parse(JSON.stringify(data));

    //descomponer data 
    let actividades:activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.semanaRealizacion,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    setActsInLS(actividades);
}

//funcion para el return, para no danhar el codigo
export const handlerActivitiesForVisitor = async (idIt: string) => {
    let data = await getActivitiesIt(idIt);
    data = JSON.parse(JSON.stringify(data));

    //descomponer data 
    let actividades:activityData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activityData = {
                id: actividad.id,
                nombre: actividad.nombre,
                estado: actividad.estado,
                fecha: actividad.fecha,
                iniciarRecordatorio: actividad.iniciarRecordatorio,
                frecuencia: actividad.frecuencia,
                hora: actividad.hora,
                accept: function (itinerary: itinerarioData, visitor: Visitor, localTime: Date): void {
                    visitor.visit(itinerary, this, localTime);
                },
                visit: function (itinerary: itinerarioData, activity: activityData, localTime: Date): void {
                    throw new Error("Function not implemented.");
                }
            };
            actividades.push(actividadData);
        }
    });
    return(actividades);
}

export const handlerActivityDetails = async (idIt: string, idAct: string) => {
    let data = await getActivitiesIt(idIt);
    data = JSON.parse(JSON.stringify(data));
    let actividad = data.find((actividad: any) => actividad.id === idAct);
    return actividad;
}

export const handlerDeleteActivity = async (itID: string, actID: string) => {
    try{
        await deleteAct(itID, actID);
        return true;
    } catch (error) {
        console.error("Error deleting activity:", error);
        return false;
    }
} 


export const handlerAddActivity = async (actividad: activityDataPrueba, idItinerario: string, file : File, nameFile: string, router : any, openDialog:any) => {
    let dataFile = await uploadFilePoster(file, nameFile);
    let data = await addActivity(idItinerario, actividad);
    if (data && dataFile) {
        console.log("Actividad agregada correctamente");
        openDialog();
    } else {
        console.log("Error al agregar la actividad");
    }
}

export const handlerEditFilePoster = async (file : File, nameFile: string, idItinerario: string, idActividad: string) => {
    let editedFile = await uploadFilePoster(file, nameFile);
    if (editedFile) {
        console.log("Afiche editado correctamente");
    } else {
        console.log("Error al editar el afiche");
    }
}


//order by semana
export const sortByWeek = async (id: string) => {
    let data = await getActivitiesIt(id);
    data = JSON.parse(JSON.stringify(data));

    let actividades: activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.semanaRealizacion,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    actividades.sort((a, b) => {
        return a.semanaRealizacion - b.semanaRealizacion;
    });
    setActsInLS(actividades);
}

//order by name
export const sortByName = async (id: string) => {
    let data = await getActivitiesIt(id);
    data = JSON.parse(JSON.stringify(data));

    let actividades: activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.semanaRealizacion,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    actividades.sort((a, b) => {
        return a.nombre.localeCompare(b.nombre);
    });
    setActsInLS(actividades);
}

//order by estado
export const sortByState = async (id: string) => {
    let data = await getActivitiesIt(id);
    data = JSON.parse(JSON.stringify(data));

    let actividades: activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.semanaRealizacion,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    actividades.sort((a, b) => {
        return a.estado.localeCompare(b.estado);
    });
    setActsInLS(actividades);
}

//buscar actividad por nombre
export const searchActivityByName = async (name: string, id: string) => {
    let data = await getActivitiesIt(id);
    data = JSON.parse(JSON.stringify(data));

    let actividades: activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.ssemanaRealizacionemana,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    actividades = actividades.filter((actividad) => {
        return actividad.nombre.toLowerCase().includes(name.toLowerCase());
    });
    setActsInLS(actividades);
}

//editar actividad
export const handlerEditActivity = async (idIt: string, idAct: string, actividad: activityDataPrueba) => {
    try {
        await editActivity(idIt, idAct, actividad);
        return true;
    } catch (error) {
        console.error("Error editing activity:", error);
        return false;
    }
}


//editar estado de actividad
export const handlerEditState = async (idIt: string, idAct: string, estado: string) => {
    try {
        await editStateActivity(idIt, idAct, estado);
        return true;
    } catch (error) {
        console.error("Error editing state:", error);
        return false;
    }
}

const setActsInLS = (actividades: activitiesItData[]) => {
    localStorage.setItem("actividades", JSON.stringify(actividades));
}

