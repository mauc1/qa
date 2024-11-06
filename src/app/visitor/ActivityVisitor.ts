import Actividad from "@/model/Actividad";
import { Visitor } from "./Visitor";
import { activityData, handlerEditState } from "../../controller/actividadController";
import { itinerarioData, searchIdItineraryByName } from "@/controller/ItinerarioController";
//this works like a concrete visitor class
export class ActivityVisitor implements Visitor{
    visit(itinerary: itinerarioData, activity: activityData, localTime: Date): void {

        //si es planeada y la fecha es menor o igual a la fecha del sistema, cambiar a notificada
        if (activity.estado === "Planeada" && new Date(activity.iniciarRecordatorio) <= localTime) {
            //cambiar estado a notificada en bd
            //aqui paso el nombre del itinerario, pero deberia ser el id
            searchIdItineraryByName(itinerary.nombre).then((id) => { //id se refiere al id del itinerario
                handlerEditState(id, activity.id, "Notificada");
                console.log("Activity: notificada");
            });
        }
    }
}