import Swal from "sweetalert2";
import { fetchSinToken, fetchWithToken } from "../helpers/fetch"
import { types } from "../types/types";
import { logoutEvent } from "./events";

export const startLogin = (email, password) => {
  return async(dispatch) => {
    const resp = await fetchSinToken('auth', { email, password }, 'POST');
    const {ok, uid, name, token, msg} =await resp.json();

    if(ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(login({ uid, name }));
    } else {
      Swal.fire('Error', msg, 'error');
    }
  }
}

export const startRegister = (email, password, name) => {
  return async(dispatch) => {
    const resp = await fetchSinToken('auth/new', { email, password, name}, 'POST');
    const body =await resp.json();

    if(body.ok) {
      console.log('todobien ');
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(login({ uid: body.uid, name: body.name }));
    } else {
      Swal.fire('Error', body.msg, 'error');
    }
  }
}

export const startChecking = () => {
  return async (dispatch) => {
    const resp = await fetchWithToken('auth/renew');
    const body =await resp.json();

    if(body.ok) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(login({ uid: body.uid, name: body.name }));
    } else {
      dispatch(checkingFinish());
    }
  }
}

export const checkingFinish = () => ({
  type: types.authCheckingFinish
});

export const login = (user) => ({
  type: types.authLogin,
  payload: user
});

export const startLogout = () => {
  return async(dispatch) => {
    localStorage.clear();
    dispatch(logout());
    dispatch(logoutEvent());
  }
}

const logout = () => ({
  type: types.authLogout
});