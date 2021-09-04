import moment from 'moment';
import { types } from '../types/types';

const initialState = {
  events:  [{
    id: new Date().getTime(),
    title: 'Cumpleaños del jefe',
    start: moment().toDate(),
    end: moment().add(2, 'hours').toDate(),
    bgColor: '#fafafa',
    user: {
      _id: '123',
      name: 'José Pedro' 
    }
  }],
  activeEvent: null
}

export const calendarReducer = (state= initialState, action) => {
  switch (action.type) {
    case types.setActiveEvent:
      return {
        ...state,
        activeEvent: action.payload
      }
    
    case types.addNewEvent:
      return {
        ...state,
        events: [...state.events, action.payload]
      }

    case types.clearActiveEvent:
      return {
        ...state,
        activeEvent: null
      }
    
    case types.updatedEvent:
      return {
        ...state,
        events: state.events.map(
          e => (e.id === action.payload.id ) ? action.payload : e
        )
      }

    case types.deletedEvent:
      return {
        ...state,
        events: state.events.filter(
          e => (e.id !== state.activeEvent.id)
        ),
        activeEvent: null
      }

    default:
      return state;
  }
}