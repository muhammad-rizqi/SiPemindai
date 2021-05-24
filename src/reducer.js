import {combineReducers} from 'redux';

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
});
