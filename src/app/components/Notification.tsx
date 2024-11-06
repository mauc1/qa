'use client';
import styles from "../page.module.css";
import Trash from "../../../public/trash.svg";
import Image from "next/image";

import { useEffect, useState } from "react";
import { set } from "firebase/database";


interface Props {
    activityName: string;
    content: string;   
    date: string;
    hour: string;
    status: boolean;
    keyValue : number;
    redirect: string;
    isDeleted : boolean;
    setNotificationAsDeleted: (keyValue: number) => void;
    setAsReaded: (keyValue: number) => void;
}


export default function Header(Props: Props) {
    const [id, setId] = useState("notification1");
    const [trashId, setTrashId] = useState("trash"+Props.keyValue);
    const [readedId, setreadedId] = useState("readed"+Props.keyValue);

    

    const { activityName, content, date, hour, status, keyValue, redirect, isDeleted } = Props;
    const { setNotificationAsDeleted, setAsReaded } = Props;
    useEffect(() => {
        if(keyValue){
            setId("notification"+keyValue);
            
        }
        
    }, [keyValue]);

    useEffect(() => {
        const readed = document.getElementById(readedId);
        if (readed) {
            readed.addEventListener("click", () => {
                setAsReaded(keyValue);
                
            });
        }
        const noti = document.getElementById(id);
        if (status) {
            
            if (noti && readed) {
                noti.classList.remove(styles.unreaded);
                readed.style.display = "none";

            }
        } else {
            const noti = document.getElementById(id);
            if (noti) {
                noti.classList.add(styles.unreaded);
            }
        }

        const trash = document.getElementById(trashId);
        if (trash) {
            trash.addEventListener("click", () => {
                
                setNotificationAsDeleted(keyValue);

            });
        }

        

    }, [status, id]);


    
    
  
  return (
    <div className={styles.notification} id={id}>
        <div className={styles.notificationHeader}>
            <p className={styles.titleNotification}>
            {activityName}
        </p>
        {!status ? null : <Image src={Trash} alt="trash" className={styles.trash} id={trashId} />}
        </div>
        
        <p className={styles.contentNotification}>
            {content}
        </p>
        <div className={styles.hourTime}>
            <p className={styles.dateNotification}>
                {date}
            </p>
            <p className={styles.hourNotification}>
                {hour}
            </p>
        </div>
        <p className={styles.setAsReaded} id={readedId}>Marcar como leído</p>
    </div>
  );
}
