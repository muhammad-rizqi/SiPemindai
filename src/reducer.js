import {combineReducers} from 'redux';

const peripherals = (state = new Map(), {type, payload}) => {
  switch (type) {
    case 'CHANGE_PERIPHERALS':
      state.set(payload.id, payload);
      return state;
    case 'CLEAR_PERIPHERALS':
      state.clear();
      return state;
    default:
      return state;
  }
};

const list = (state = [], {type, payload}) => {
  switch (type) {
    case 'CHANGE_DEVICES':
      return payload;
    default:
      return state;
  }
};

const loger = (state = [], {type, payload}) => {
  switch (type) {
    case 'CHANGE_LOG':
      return [...state, payload];
    case 'DELETE_LOG':
      return [];
    default:
      return state;
  }
};

export default combineReducers({
  list,
  loger,
  peripherals,
});
