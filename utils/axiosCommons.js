import axios from 'axios';
import _cloneDeep from 'lodash/cloneDeep';
import errorInterceptor from 'utils/axios-commons/interceptors/errorInterceptor';
import errorLogInterceptor from 'utils/axios-commons/interceptors/errorLogInterceptor';
import sanitizeSchema from 'utils/axios-commons/utils/sanitizeSchema';

/*
 * INTERCEPTORS
 */


export const interceptors = {
  // JWTHTTPUnauthorizedInterceptor,
  JWTInterceptor,
};
