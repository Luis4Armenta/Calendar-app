import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'

import { Navbar } from '../ui/Navbar'
import { messages } from '../../helpers/calendar-messages'

import 'moment/locale/es-mx';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from './CalendarEvent'
import { CalendarModal } from './CalendarModal'
import { useDispatch, useSelector } from 'react-redux'
import { uiOpenModal } from '../../actions/ui'
import { clearActiveEvent, eventStartLoading, setActiveEvent } from '../../actions/events'
import { AddNewFab } from '../ui/AddNewFab'
import { DeleteEventFab } from '../ui/DeleteEventFab'

moment.locale('es');

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
  const { uid } = useSelector( state => state.auth );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(eventStartLoading());
  }, [dispatch]);
  
  const { events, activeEvent } = useSelector( state => state.calendar );

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem('lastView', e);
  }

  const onSelectEvent = (event) => {
    dispatch(setActiveEvent(event));
  }
  
  const onDoubleClick = (e) => {
    dispatch(uiOpenModal());
  }

  const onSelectSlot = (e) => {
    dispatch(clearActiveEvent());
  }

  const eventStyleGetter = ( event, start, end, isSelected ) => {
    const style = {
      backgroundColor: (uid === event.user._id) ? '#367CF7': '#465650',
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
        onSelectSlot={ onSelectSlot }
        selectable={ true }
        onView={ onViewChange }
        view={lastView}
        components={{
          event: CalendarEvent
        }}
      />
       <AddNewFab />

       {
          (activeEvent) && <DeleteEventFab />
       }
       
      <CalendarModal />
    </div>
  )
}
