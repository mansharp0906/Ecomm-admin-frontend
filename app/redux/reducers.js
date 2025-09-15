import { combineReducers } from '@reduxjs/toolkit';
import ui from './modules/ui';

export default function createReducer() {
  const rootReducer = combineReducers({
    ui,
  });

  return rootReducer;
}
