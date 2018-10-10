import _cloneDeep from 'lodash/cloneDeep';

/**
 * Removes custom keys from axios config schema.
 *
 * @method
 * @param {Object} axiosSchema
 * @return {Object}
 */
export default function sanitizeSchema(axiosSchema) {
  const schema = _cloneDeep(axiosSchema);

  delete schema.redux;
  delete schema.store;

  return schema;
}
