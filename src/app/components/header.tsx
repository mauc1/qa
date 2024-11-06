'use client';
import styles from "../page.module.css";
import Bell from "../../../public/bell.svg";
import DotBell from "../../../public/bell-dot.svg";
import { use, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Profile from "../../../public/user-round.svg";
import Notification from "./Notification"

type Notification = {
  activityName: string;
  content: string;
  date: string;
  hour: string;
  status: boolean;
  keyValue: number;
  redirect: string;
  isDeleted : boolean
};
interface Props {
	bell: boolean;
	userName: string;
	notificationsProps: Notification[];
}

// Función para eliminar duplicados
function removeDuplicates(arr : Notification[]) {
  const uniqueActivities = [];
  const seen = new Set();
  
  for (const activity of arr) {
      // Crea una clave única basada en las propiedades del objeto
      const uniqueKey = `${activity.activityName}-${activity.date}-${activity.hour}`;
      
      if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          uniqueActivities.push(activity);
      }
  }
  
  return uniqueActivities;
}

const orderNotificationsByDateAndTime = (notifications: Notification[]): Notification[] => {
  return notifications.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('/').map(Number);
    const [dayB, monthB, yearB] = b.date.split('/').map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA, ...a.hour.split(':').map(Number));
    const dateB = new Date(yearB, monthB - 1, dayB, ...b.hour.split(':').map(Number));

    return dateB.getTime() - dateA.getTime();
  });
};

const filterNotificationsByDeleted = (notifications: Notification[]): Notification[] => {
  return notifications.filter(notification => !notification.isDeleted);
}



export default function Header(Props: Props) {
  const { bell, userName, notificationsProps } = Props;
  const [flag, setFlag] = useState(true);
  const [notis, setNotis] = useState<Notification[]>([]);
  const [displayedNotis, setDisplayedNotis] = useState<Notification[]>([]);



  const setNotificationAsDeleted = useCallback((keyValue : any) => {
    setNotis((prevNotis) =>
      prevNotis.map(notification =>
        notification.keyValue === keyValue
          ? { ...notification, isDeleted: true }
          : notification
      )
    );
  }, []);

  const setAsReaded = useCallback((keyValue : any) => {
    setNotis((prevNotis) =>
      prevNotis.map(notification =>
        notification.keyValue === keyValue
          ? { ...notification, status: true }
          : notification
      )
    );
  }, []);

  useEffect(() => {
    setNotis(removeDuplicates(notificationsProps));
  }, [notificationsProps]);

  useEffect(() => {
    setDisplayedNotis(orderNotificationsByDateAndTime(filterNotificationsByDeleted(notis)));
  }, [notis]);

  useEffect(() => {
    const handleSeeAllClick = () => {
      setDisplayedNotis(orderNotificationsByDateAndTime(filterNotificationsByDeleted(notis)));
      if (seeAll && seeReaded && seeUnreaded) {
        seeAll.classList.add(styles.selectedOption);
        seeReaded.classList.remove(styles.selectedOption);
        seeUnreaded.classList.remove(styles.selectedOption);
      }

    };

    const handleSeeReadedClick = () => {
      setDisplayedNotis(orderNotificationsByDateAndTime(filterNotificationsByDeleted(notis.filter(notification => notification.status))));
      if (seeAll && seeReaded && seeUnreaded) {
        seeReaded.classList.add(styles.selectedOption);
        seeAll.classList.remove(styles.selectedOption);
        seeUnreaded.classList.remove(styles.selectedOption);
      }

    };

    const handleSeeUnreadedClick = () => {
      setDisplayedNotis(orderNotificationsByDateAndTime(filterNotificationsByDeleted(notis.filter(notification => !notification.status))));
      if (seeAll && seeReaded && seeUnreaded) {
        seeUnreaded.classList.add(styles.selectedOption);
        seeAll.classList.remove(styles.selectedOption);
        seeReaded.classList.remove(styles.selectedOption);
      }
    };

    const handleBellImgClick = () => {
      if (flag) {
        if (notificationFrame && piquito) {
        notificationFrame.classList.add(styles.show);
        piquito.classList.add(styles.show);
        }
      } else {
        if (notificationFrame && piquito) {
        notificationFrame.classList.remove(styles.show);
        piquito.classList.remove(styles.show);
        }
      }
      setFlag(prevFlag => !prevFlag);
    };

    const seeAll = document.getElementById("seeAll");
    const seeReaded = document.getElementById("seeReaded");
    const seeUnreaded = document.getElementById("seeUnreaded");
    const bellImg = document.getElementById("BellBoton");
    const piquito = document.getElementById("piquito");
    const notificationFrame = document.getElementById("notificationFrame");

    if (seeAll && seeReaded && seeUnreaded && bellImg && piquito && notificationFrame) {
      seeAll.addEventListener("click", handleSeeAllClick);
      seeReaded.addEventListener("click", handleSeeReadedClick);
      seeUnreaded.addEventListener("click", handleSeeUnreadedClick);
      bellImg.addEventListener("click", handleBellImgClick);
    }

    return () => {
      if (seeAll && seeReaded && seeUnreaded && bellImg && piquito && notificationFrame) {
        seeAll.removeEventListener("click", handleSeeAllClick);
        seeReaded.removeEventListener("click", handleSeeReadedClick);
        seeUnreaded.removeEventListener("click", handleSeeUnreadedClick);
        bellImg.removeEventListener("click", handleBellImgClick);
      }
    };
  }, [flag, notis]);

  return (
    <header className={styles.header}>
      <div className={styles.userPill}>
        <Image src={Profile} alt="profile-symbol" />
        <p>{userName}</p>
      </div>
      <div className={styles.notificationBell} id="bellIcon">
        <Image src={bell ? DotBell : Bell} alt="Notification Bell" id="BellBoton" />
        <div className={styles.piquitoFrame} id="piquito"></div>
        <div className={styles.notificationFrame} id="notificationFrame">
          <span>Notificaciones</span>
          <div className={styles.displayOptions}>
            <p className={styles.displayOption} id="seeAll">Todas</p>
            <p className={styles.displayOption} id="seeReaded">Leídas</p>
            <p className={styles.displayOption} id="seeUnreaded">No leídas</p>
          </div>
          <div className={styles.notificationTable}>
            {displayedNotis.map((notification) => (
              <Notification
                key={notification.keyValue}
                activityName={notification.activityName}
                content={notification.content}
                date={notification.date}
                hour={notification.hour}
                status={notification.status}
                keyValue={notification.keyValue}
                redirect={notification.redirect}
                isDeleted={notification.isDeleted}
                setNotificationAsDeleted={setNotificationAsDeleted}
                setAsReaded={setAsReaded}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}