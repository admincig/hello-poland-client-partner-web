import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import Grid from '@material-ui/core/Grid';
import isArray from './utils/isArray';

class FormGenerator extends Component {
  shouldComponentUpdate(nextProps) {
    const { data, schema } = this.props;

    const isDataDirty = !_isEqual(nextProps.data, data);
    const isSchemaDirty = !_isEqual(nextProps.schema, schema);

    return isDataDirty || isSchemaDirty;
  }

  getComponentsFromSchema = (schema, data, keyPath = '') => {
    const { onChange, renderGroup } = this.props;

    return schema.map((item) => {
      const {
        component: FormComponent, key, props, schema: itemSchema, value,
      } = item;

      const keyName = keyPath.length ? `${keyPath}.${key}` : key;

      if (isArray(itemSchema) && itemSchema.length) {
        const children = this.getComponentsFromSchema(itemSchema, data, keyName);

        return renderGroup({ children, item });
      }

      let componentValue = value != null ? value : '';

      if (data[keyName] != null) {
        componentValue = data[keyName];
      }

      return (
        <FormComponent
          key={keyName}
          name={keyName}
          onChange={onChange(keyName)}
          value={componentValue}
          {...props}
        />
      );
    });
  };

  render() {
    const {
      data, onChange, renderGroup, schema, ...rest
    } = this.props;

    if (!isArray(schema) || !schema.length) {
      return null;
    }

    return (
      <Grid container {...rest}>
        {this.getComponentsFromSchema(schema, data)}
      </Grid>
    );
  }
}

FormGenerator.propTypes = {
  data: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  renderGroup: PropTypes.func,
  schema: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),
    key: PropTypes.string,
    props: PropTypes.shape({}),
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
    ]),
  })).isRequired,
};

FormGenerator.defaultProps = {
  data: {},
  renderGroup: () => {},
};

export default FormGenerator;
