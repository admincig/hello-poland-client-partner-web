import { logic as configLogic } from 'redux/config';
import { logic as viewLogic } from 'redux/view';
import { logic as moviesLogic } from 'redux/movies';

export default [
  ...configLogic,
  ...viewLogic,
  ...moviesLogic,
];
