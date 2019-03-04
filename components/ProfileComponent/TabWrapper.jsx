import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const TAB_TYPES = {
  profile: 0,
  password: 1,
};

const styles = theme => ({
  childrenRoot: {
    padding: theme.spacing.unit * 2,
  },
  tabsRoot: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
});

class TabWrapper extends Component {
  constructor(props) {
    super(props);

    const { active } = props;

    this.state = {
      selectedTab: TAB_TYPES[active],
    };
  }

  handleTabChange = (event, value) => {
    const { onChange } = this.props;

    this.setState({ selectedTab: value });

    const nextTabType = Object.entries(TAB_TYPES).filter((type) => {
      const [k, v] = type;
      return k.length && value === v;
    });

    onChange(nextTabType[0][0]);
  };

  render() {
    const { selectedTab } = this.state;
    const { children, classes } = this.props;
    return (
      <Paper>
        <Tabs
          className={classes.tabsRoot}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          value={selectedTab}
        >
          <Tab label="Profil" />
          <Tab label="Hasło" />
        </Tabs>
        <div className={classes.childrenRoot}>
          {children}
        </div>
      </Paper>
    );
  }
}

TabWrapper.propTypes = {
  active: PropTypes.string.isRequired,
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(TabWrapper);
