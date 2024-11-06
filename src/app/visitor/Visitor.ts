//interface for visitor pattern
import { activityData } from "@/controller/actividadController";
import { itinerarioData } from "@/controller/ItinerarioController";

export interface Visitor {
    visit(itinerary: itinerarioData, activity: activityData, localTime: Date): void;
}