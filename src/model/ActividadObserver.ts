import Actividad from "./Actividad";

export interface ActividadObserver {
	update(contenido: string, nombreActividad: string): void;
}
