import { combineReducers } from 'redux';
import config, { name as configName } from 'redux/config';
import view, { name as viewName } from 'redux/view';
import counter, { name as counterName } from 'views/HomeView/redux/counter';
import movies, { name as moviesName } from 'redux/movies';

export default combineReducers({
  [configName]: config,
  [counterName]: counter,
  [moviesName]: movies,
  [viewName]: view,
});
