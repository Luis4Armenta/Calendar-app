import Swal from "sweetalert2";
import { fetchWithToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types"

export const startAddNewEvent = (event) => {
  return async(dispatch, getState) => {
    const { uid, name } = getState().auth;
    
    try {
      const resp = await fetchWithToken('events', event, 'POST')
      const body = await resp.json();

      if (body.ok) {
        event.id = body.event.id;
        event.user = {
          _id: uid,
          name: name
        }

        dispatch(addNewEvent(event));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

const addNewEvent = (event) => ({
  type: types.addNewEvent,
  payload: event
});

export const setActiveEvent = (event) => ({
  type: types.setActiveEvent,
  payload: event
});

export const clearActiveEvent = () => ({ type: types.clearActiveEvent });

export const startEventUpdate = (event) => {
  return async(dispatch) => {
    try {
      const resp = await fetchWithToken(`events/${event.id}`, event, 'PUT');
      const body = await resp.json();

      if (body.ok) {
        dispatch(eventUpdated(event));
      } else {
        Swal.fire('Error', body.msg, 'error');
      }
    } catch (error) {
      console.error(error);
    }
  }
}


const eventUpdated = ( event ) => ({
  type: types.updatedEvent,
  payload: event
});

export const startDeleteEvent = () => {
  return async(dispatch, getState) => {
    const { id } = getState().calendar.activeEvent;
    try {
      const resp = await fetchWithToken(`events/${id}`, {}, 'DELETE');
      const body = await resp.json();

      if (body.ok) {
        dispatch(eventDeleted());
      } else {
        Swal.fire('Error', body.msg, 'error');
      }
    } catch (error) {
      console.error(error);
    }
  }
}

const eventDeleted = () => ({ type: types.deletedEvent });

export const eventStartLoading = () => {
  return async(dispatch) => {
    try {
      const resp = await fetchWithToken('events');
      const body = await resp.json();

      const events = prepareEvents(body.events)

      dispatch(eventLoaded(events));
    } catch (error) {
      console.error(error);
    }
  }
}

const eventLoaded = (events) => ({
  type: types.eventLoaded,
  payload: events
});

export const logoutEvent = () => ({ type: types.logoutEvent });