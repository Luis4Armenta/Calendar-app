import React, { useState } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'

import { Navbar } from '../ui/Navbar'
import { messages } from '../../helpers/calendar-messages'

import 'moment/locale/es-mx';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from './CalendarEvent'
import { CalendarModal } from './CalendarModal'

moment.locale('es');

const localizer = momentLocalizer(moment);

const events = [{
  title: 'Cumpleaños del jefe',
  start: moment().toDate(),
  end: moment().add(2, 'hours').toDate(),
  bgColor: '#fafafa',
  user: {
    _id: '123',
    name: 'José Pedro' 
  }
}];

export const CalendarScreen = () => {
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem('lastView', e);
  }

  const onSelectEvent = (e) => {
    console.log(e);
  }
  
  const onDoubleClick = (e) => {
    console.log(e)
  }

  const eventStyleGetter = ( event, start, end, isSelected ) => {
    const style = {
      backgroundColor: '#367CF7',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white',
    }

    return {
      style
    }
  }
  return (
    <div>
      <Navbar />
      <Calendar className="calendar-screen"
        localizer={ localizer }
        events={ events }
        startAccessor="start"
        endAccessor="end"
        messages={ messages }
        eventPropGetter={ eventStyleGetter }
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelectEvent }
        onView={ onViewChange }
        view={lastView}
        components={{
          event: CalendarEvent
        }}
      />

      <CalendarModal />
    </div>
  )
}
