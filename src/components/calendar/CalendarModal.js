import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import moment from 'moment'
import Swal from "sweetalert2";

import DateTimePicker from 'react-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { clearActiveEvent, startAddNewEvent, startEventUpdate } from '../../actions/events';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const DEFAULT_TIME_START_DATE = moment().minutes(0).second(0).add(1, 'hours')
const DEFAULT_TIME_END_DATE = DEFAULT_TIME_START_DATE.clone().add(1, 'hour');

const initEvent = {
  title: '',
  notes: '',
  start: DEFAULT_TIME_START_DATE.toDate(),
  end: DEFAULT_TIME_END_DATE.toDate()
}

export const CalendarModal = () => {
  const dispatch = useDispatch();
  
  const { modalOpen } = useSelector( state => state.ui );
  const { activeEvent } = useSelector( state => state.calendar );

  const [dateStart, setDateStart] = useState(DEFAULT_TIME_START_DATE.toDate());
  const [dateEnd, setDateEnd] = useState(DEFAULT_TIME_END_DATE.toDate());
  const [titleValid, setTitleValid] = useState(true)

  const [formValues, setFormValues] = useState(initEvent);

  const { notes, title, start, end } = formValues;

  useEffect(() => {
    if (activeEvent) {
      setFormValues( activeEvent );
    } else {
      setFormValues(initEvent);
    }
  }, [activeEvent, setFormValues]);

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    })
  }

  const closeModal = () => {
    dispatch(uiCloseModal());
    dispatch(clearActiveEvent());
    setFormValues(initEvent);
  }

  const handleStartDateChange = (date) => {
    setDateStart(date);
    setFormValues({
      ...formValues,
      start: date
    });
  }

  const handleEndDateChange = (date) => {
    setDateEnd(date);
    setFormValues({
      ...formValues,
      end: date
    });
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const momentStart = moment(start);
    const momentEnd = moment(end);
    
    if (momentStart.isSameOrAfter(momentEnd)) {
      return Swal.fire('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error');
    }

    if (title.trim().length < 2) {
      return setTitleValid(false);
    }

    if (activeEvent) {
      dispatch(startEventUpdate(formValues));
    } else {
      dispatch(startAddNewEvent(formValues));
    }

    setTitleValid(true);
    closeModal();
  }
  
  return (
    <Modal
      isOpen={modalOpen}
      // onAfterOpen={ afterOpenModal }
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h1> { (activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
      <hr />
      <form 
        className="container"
        onSubmit={ handleSubmitForm }
      >

        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={ handleStartDateChange }
            value={ dateStart }
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={ handleEndDateChange }
            value={ dateEnd }
            minDate={ dateStart }
            className="form-control"
          />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={ `form-control ${ !titleValid && 'is-invalid'}` }
            placeholder="T??tulo del evento"
            name="title"
            autoComplete="off"
            value={ title }
            onChange= { handleInputChange }
          />
          <small id="emailHelp" className="form-text text-muted">Una descripci??n corta</small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={ notes }
            onChange= { handleInputChange }
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Informaci??n adicional</small>
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>

      </form>
    </Modal>
  )
}
