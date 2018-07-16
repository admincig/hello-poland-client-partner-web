import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import isArray from './utils/isArray';

class FormGenerator extends Component {
  getComponentsFromSchema = (schema, keyPath = '') => {
    const { onChange, renderGroup } = this.props;

    return schema.map((item) => {
      const {
        component: FormComponent, key, props, schema: itemSchema, value,
      } = item;

      const keyName = keyPath.length ? `${keyPath}.${key}` : key;
      let FormContent = null;


      if (isArray(itemSchema) && itemSchema.length) {
        const children = this.getComponentsFromSchema(itemSchema, keyName);

        FormContent = () => renderGroup({ children, item });
      } else {
        FormContent = () => (
          <FormComponent
            key={keyName}
            onChange={onChange(keyName)}
            value={value !== null ? value : ''}
            {...props}
          />
        );
      }

      return <FormContent key={key} />;
    });
  };

  render() {
    const {
      onChange, renderGroup, schema, ...rest
    } = this.props;

    if (!isArray(schema) || !schema.length) {
      return null;
    }

    return (
      <Grid container {...rest}>
        {this.getComponentsFromSchema(schema)}
      </Grid>
    );
  }
}

FormGenerator.propTypes = {
  onChange: PropTypes.func.isRequired,
  renderGroup: PropTypes.func,
  schema: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),
    key: PropTypes.string.isRequired,
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
  renderGroup: () => {},
};

export default FormGenerator;
