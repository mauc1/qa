import { ActividadObserver } from "./ActividadObserver";
import Actividad from "./Actividad";

type Notification = {
	activityName: string;
	content: string;
	date: string;
	hour: string;
	status: boolean;
	keyValue: number;
	redirect: string;
	isDeleted: boolean;
};

export class NotificarActividad implements ActividadObserver {
	private addNotification: (notificacion: Notification) => void;
	private keyValue: number;
	private setKeyValue: (num: number) => void;

	constructor(
		addNotification: (notificacion: Notification) => void,
		keyValue: number,
		setKeyValue: (num: number) => void
	) {
		this.addNotification = addNotification,
		this.keyValue = keyValue,
		this.setKeyValue = setKeyValue;
	}
	update(contenido: string, nombreActividad: string) {
		const notificacion: Notification = {
			activityName: nombreActividad,
			content: contenido,
			date: new Date().toLocaleDateString(),
			hour: new Date().toLocaleTimeString(),
			status: false,
			keyValue: this.keyValue,
			redirect: "",
			isDeleted: false,
		};
		this.addNotification(notificacion);
		this.setKeyValue(this.keyValue + 1);
		console.log(
			`La actividad con ID ${nombreActividad} tiene una fecha que coincide con la fecha actual.`
		);
	}
}

export default NotificarActividad;
