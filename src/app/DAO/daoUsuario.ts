import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../constants/connection";

export const dynamic = 'force-dynamic'; // Force dynamic route behavior
interface User {
  correo: string;
  contraseña: string;
  rol: string;
  celular: string;
}
export async function searchUserByEmail(email : string): Promise<User | null> {
  const database = db;
  const usersRef = collection(database, 'usuarios');
  const user = query(usersRef, where("correo", "==", email));
  const querySnapshot = await getDocs(user);
  let data = null;
  querySnapshot.forEach((doc) => {
      data = doc.data();
      data.id = doc.id;
  });
  return data;
}

export async function changePassword(userId : string, password : string) {
  const database = db;
  const usersRef = doc(database, 'usuarios', userId);
  await updateDoc(usersRef, {
    contraseña: password
  });
}

export async function getIdUserByEmail(email : string) {
  const database = db;
  const usersRef = collection(database, 'usuarios');
  const user = query(usersRef, where("correo", "==", email));
  const querySnapshot = await getDocs(user);
  let data = null;
  querySnapshot.forEach((doc) => {
      data = doc.id;
  });
  return data;
}

export async function searchStudentByEmail(email: string): Promise<any | null> {
  const studentsRef = collection(db, 'estudiantes');
  const studentQuery = query(studentsRef, where('correo', '==', email));
  const querySnapshot = await getDocs(studentQuery);
  let studentData = null;
  querySnapshot.forEach((doc) => {
      studentData = doc.data();
      studentData.id = doc.id;
  });
  return studentData;
}