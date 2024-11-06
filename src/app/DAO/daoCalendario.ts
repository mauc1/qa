import { orderBy, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../constants/connection";
import Actividad from "@/model/Actividad";

export async function getAllActivities() {
	const database = db;
	const itinerarioRef = collection(database, "itinerarios");
	const itinerarioSnapshot = await getDocs(itinerarioRef);
	let actividades: Actividad[] = [];
	for (const itinerarioDoc of itinerarioSnapshot.docs) {
		const actividadRef = collection(itinerarioDoc.ref, "actividades");
		const actividadSnapshot = await getDocs(actividadRef);
		actividadSnapshot.forEach((doc) => {
			const actividad = doc.data() as Actividad;
			actividades.push(actividad);
		});
	}
	return actividades;
}