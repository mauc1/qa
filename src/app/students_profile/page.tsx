'use client';
import styles from '../page.module.css';
import { BlueButton } from '../components/blueButton';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Profile from '../../../public/Profile.png';
import { handlerOneLoadUser} from "../../controller/studentsController";
import EstudianteUsuario from '@/model/EstudianteUsuario';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { profile } from 'console';
import { GreenButton } from '../components/greenButton';


export default function StudentProfile() {
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const router = useRouter();
    const [loadData, setloadData] = useState<EstudianteUsuario[]>([]);
    const [data, setData] = useState({
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        correo: '',
        carne: '',
        celular: '',
        sede: '',
        fotoPerfil: '',
        contrasena: '',
        rol: '',
        estado: '',
    });

    let carne = '';
    useEffect(() => {
        console.log(window)
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem("user");
            if (storedData) {
                console.log(storedData);
                const studentData = JSON.parse(storedData);
                carne = studentData.carne;
            } else {
                console.log("No data found in localStorage for key 'user'");
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadData = await handlerOneLoadUser(carne);
                setloadData([...loadData]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (loadData.length > 0) {
            setData({
                nombre: loadData[0].nombre,
                primerApellido: loadData[0].primerApellido,
                segundoApellido: loadData[0].segundoApellido,
                correo: loadData[0].correo,
                estado: loadData[0].estado,
                celular: loadData[0].celular,
                contrasena: loadData[0].contrasena,
                carne: loadData[0].carne,
                sede: loadData[0].sede,
                rol: loadData[0].rol,
                fotoPerfil: loadData[0].foto
            });
            if (loadData[0].foto!=""){
                handleLoadProfile(loadData[0].foto);
            }
        }
    }, [loadData]);

    const handleLoadProfile = (imageUrl: string) => {
        const storage = getStorage();
        const starsRef = ref(storage, 'gs://teamtec-727df.appspot.com/profile/' + imageUrl);
        getDownloadURL(starsRef)
            .then((url) => {
                console.log(url);
                setCurrentImageUrl(url);
            })
            .catch((error) => {
                console.error("Error downloading image:", error);
            });
    };

    return (
        <main className={styles.main} id="main">
            <div className={styles.professorRegisterContainer}>
                <h1>Perfil estudiante</h1>
                <div className={styles.professorScreenDivider}>
                    <div className={styles.formRegisterProfessors}>
                        <form className={styles.formContainerRegisterProfessors}>
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="name">Nombre</label>
                                <input type="name" id="name" name="name" required placeholder="..." value={data.nombre} readOnly/>
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="carne">Carne</label>
                                <input type="text" id="carne" name="carne" placeholder="..." value={data.carne} readOnly/>
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="first_lastName">Primer Apellido</label>
                                <input type="text" id="first_lastName" name="first_lastName" required placeholder="..." value={data.primerApellido} readOnly/>
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="second_lastName">Segundo Apellido</label>
                                <input type="text" id="second_lastName" name="second_lastName" required placeholder="..." value={data.segundoApellido} readOnly/>
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="email">Correo</label>
                                <input type="email" id="email" name="email" required placeholder="..." value={data.correo} readOnly/>
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="cellphone">Número celular</label>
                                <input type="tel" id="cellphone" name="cellphone" required placeholder="..." value={data.celular} readOnly/>
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="sede">Sede</label>
                                <input type="text" id="sede" name="sede" required placeholder="..." value={data.sede} readOnly/>
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" id="password" name="password" required placeholder="..." value={data.contrasena} readOnly/>
                            </div>
                            
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="rol">Rol</label>
                                <input type="text" id="rol" name="rol" required placeholder="..." value={data.rol} readOnly />
                            </div>
                            
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="estado">Estado</label>
                                <input type="text" id="estado" name="estado" required placeholder="..." value={data.estado} readOnly />
                            </div>


                        </form>


                    </div>
                    <div className={styles.dividerLine}>
                        <span></span>
                    </div>

                    <div className={styles.photoProfessorContainer}>

                        {currentImageUrl != '' && (
                            <Image src={currentImageUrl} alt="Profile" width={500} height={500} />
                        )}
                        {currentImageUrl == '' && (
                            <Image src={Profile} alt="Profile" />
                        )}
                    </div>

                </div>

                <div className={styles.buttonEditContainer}>
                    <BlueButton text="Salir" onClick={() => { router.push(`/mainMenu`) }} type='button' />
                    <BlueButton text="Editar" onClick={() => { router.push(`/students_user_editor`) }} type='button' />

                </div>
            </div>
        </main>
    );
}