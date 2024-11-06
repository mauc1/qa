'use client';
import styles from '../page.module.css';
import Link from 'next/link';
import { BlueButton } from '../components/blueButton';
import Image from 'next/image';
import Profile from '../../../public/Profile.png';
import PopUp from '../components/popUpInformation';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { handlerDeleteFile, handlerUploadFile } from "../../controller/profesorController";
import { handlerUpdateUserController, handlerOneLoadUser, handlerUpdateController } from "../../controller/studentsController";
import EstudianteUsuario from '@/model/EstudianteUsuario';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { profile } from 'console';

// Función para generar un nombre único para el archivo
const generateUniqueFileName = (originalFileName: string) => {
    const uniqueId = uuidv4(); // Función para generar un UUID
    const fileExtension = originalFileName.split('.').pop();
    return `${uniqueId}.${fileExtension}`;
};

// Función para generar un UUID (Identificador Único Universal)
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export default function ProfessorEditor() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [currentTitle, setcurrentTitle] = useState("");
    const [currentMessage, setcurrentMessage] = useState("");
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [originalFileName, setoriginalFileName] = useState("");

    const router = useRouter();
    const [loadData, setloadData] = useState<EstudianteUsuario[]>([]);
    const [data, setData] = useState({
        cellphone: '',
        fotoPerfil: '',
        password: '',
    });

    const openDialog = () => {
        console.log("Abriedo dialogo");
        setDialogOpen(true);
    };

    const closeDialog = () => {
        console.log("Cerrando dialogo");
        setDialogOpen(false);
    };

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

    let rol = '';
    let sede = '';
    let nombre = '';
    let correo_usuario = '';

    if (typeof window !== 'undefined') {
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            rol = userData.rol;
            sede = userData.centroAcademico;
            nombre = userData.nombre;
            correo_usuario = userData.correo;
        } else {
            console.log("No data found in localStorage for key 'user'");
        }
    }

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
                password: loadData[0].contrasena,
                cellphone: loadData[0].celular,
                fotoPerfil: loadData[0].foto
            });
            setoriginalFileName(loadData[0].foto);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        });
    };

    const handlerfileName = (name: string) => {
        setData({
            ...data,
            fotoPerfil: name
        });
    }

    const handlerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            const fileName = selectedFile.name;
            const fileExtension = fileName.split('.').pop()?.toLowerCase();
            if (!fileExtension || (fileExtension !== 'pdf' && fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg')) {
                alert("El archivo seleccionado no es válido");
                return;
            }
            if (data.fotoPerfil != originalFileName) {
                handlerDeleteFile(data.fotoPerfil);
            }
            const newName = generateUniqueFileName(fileName);
            handlerfileName(newName);
            setFile(selectedFile);
            handlerUploadFile(selectedFile, newName)
                .then(resulta => {
                    console.log(resulta);
                    if (resulta) {
                        handleLoadProfile(newName);
                    } else {
                    }
                })
                .catch(error => {
                    console.log("Error cargando la imagen");
                });
        }
    };

    const handleEdit = async () => {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key as keyof typeof data] === '' && key != "fotoPerfil") {
                    console.log(`${key} está vacío.`);
                    setcurrentTitle(`Hay datos vacíos.`);
                    setcurrentMessage("Se necesita agregar toda la información");
                    openDialog();
                    return;
                }
            }
        }
        if (data.fotoPerfil != originalFileName) {
            handlerDeleteFile(originalFileName);
        }
        handlerUpdateUserController(loadData[0].carne, data, loadData);
        router.push(`/mainMenu`);
        
    };

    const handleCancele = () => {
        if (data.fotoPerfil != originalFileName) {
            handlerDeleteFile(data.fotoPerfil);
        }
        router.push(`/students_profile`)
    };



    return (
        <main className={styles.main} id="main">
            <PopUp
                title={currentTitle}
                content={currentMessage}
                openDialog={openDialog}
                closeDialog={closeDialog}
                dialogOpen={dialogOpen}
            />
            <div className={styles.professorRegisterContainer}>
                <h1>Editar Perfil</h1>
                <div className={styles.professorScreenDivider}>
                    <div className={styles.formRegisterProfessors}>
                        <form className={styles.formContainerRegisterProfessors}>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="cellphone">Número celular</label>
                                <input type="tel" id="cellphone" name="cellphone" required placeholder="..." value={data.cellphone}  onChange={handleChange} />
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" id="password" name="password" required placeholder="..." value={data.password}  onChange={handleChange} />
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
                        <label htmlFor="photo">Subir foto de perfil</label>
                        <input type="file" id="photo" name="photo" accept="image/*" hidden onChange={handlerFile} />


                    </div>

                </div>

                <div className={styles.buttonEditContainer}>
                    <BlueButton text="Guardar" onClick={() => { handleEdit() }} type='button' />
                    <button className={styles.buttonCancel} onClick={() => { handleCancele() }}>Cancelar</button>
                </div>
            </div>
        </main>
    );
}