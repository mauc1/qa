'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllActivities } from "../DAO/daoCalendario";

const localizer = dayjsLocalizer(dayjs);

interface Activity {
  id: string;
  fecha: string;
  title: string;
  start: Date;
  end: Date;
  // Otros campos que tengas
}

function Calendario() {
  const [actividades, setActividades] = useState<Activity[]>([]);

  useEffect(() => {
    const getActivities = async () => {
      const activities = await getAllActivities();
      // Format the activities for react-big-calendar
      const formattedActivities = activities.map(activity => {
        const start = new Date(activity.fecha);
        const end = new Date(activity.fecha);
        const title = activity.nombre;

        // Check if date is valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error(`Invalid date for activity ${activity.id}: ${activity.fecha}`);
          return null;
        }

        return {
          ...activity,
          title,
          start,
          end,
        };
      }).filter(activity => activity !== null); 

      setActividades(formattedActivities as Activity[]);
    };

    getActivities();
  }, []);

  return (
    <div>
      <h1>Calendario de Actividades</h1>
      <Calendar
        localizer={localizer}
        events={actividades}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default Calendario;