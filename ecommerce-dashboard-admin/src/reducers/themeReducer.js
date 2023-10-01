import { configure } from '@testing-library/react';
import * as actions from '../actions/themeActions'

export const initialState = {
  isOpen:[],
  defaultId:'default',
  fontFamily:configure.fontFamily,
  borderRadius:configure.borderRadius,
  opened:true
}

export const themeReducer = (state = {darkMode:false}, action) => {
    switch (action.type) {
      case actions.TOGGLE_LIGHT_DARK:
        return Object.assign({}, state, {
            darkMode: !state.darkMode
        });
  
      default:
        return state;
    }
  };

export const customizationReducer = (state = initialState, action) => {
  let id;
  switch (action.type) {
      case actions.MENU_OPEN:
          id = action.id;
          return {
              ...state,
              isOpen: [id]
          };
      case actions.SET_MENU:
          return {
              ...state,
              opened: action.opened
          };
      case actions.SET_FONT_FAMILY:
          return {
              ...state,
              fontFamily: action.fontFamily
          };
      case actions.SET_BORDER_RADIUS:
          return {
              ...state,
              borderRadius: action.borderRadius
          };
      default:
          return state;
  }
};
