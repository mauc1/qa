import {handlerGetIdItineraryByName, handlerItinerarioForVisitor } from "@/controller/ItinerarioController";
import { handlerActivitiesForVisitor } from "@/controller/actividadController";
import { ActivityVisitor } from "../visitor/ActivityVisitor";

//make visitable interface from the visitor pattern
export function VisitableAct(localTime: Date): void {
    //for itinerary, activity
    handlerItinerarioForVisitor().then((itinerary) => {
        console.log(itinerary);
        //por cada nombre en la lista 'itinerary' que nos devolvio el handler, iteramos para sacar las actividades de ese nombre de itinerario 
        itinerary.forEach((itSelf) => { //itSelf (itinerary it selfs
            console.log(itSelf);
            //esta funcion es del itinerarioController, como parametro recibe el nombre del itinerario y devuelve el ID de ese itinerario
            handlerGetIdItineraryByName(itSelf.nombre).then((id) => {
                //aqui obtengo las actividades de ese itinerario (gracias al id)
                handlerActivitiesForVisitor(id).then((activities) => { //VERIFICAR QUE SEA STRING
                    console.log(activities);
                    //por cada actividad en la lista 'activities' que nos devolvio el handler, iteramos para sacar las actividades de ese nombre de itinerario 
                    activities.forEach((act) => {
                        //aqui se hace el accept de la actividad, para que el visitor haga su trabajo
                        //act.accept(itSelf, act, localTime);
                        console.log(act);
                        ActivityVisitor.prototype.visit(itSelf, act, localTime);
                    });
                });
            });
        });
    });    
}