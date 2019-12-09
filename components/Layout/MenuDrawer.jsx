import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Link from 'next/link';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    minWidth: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    minWidth: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
});

const MenuDrawer = ({
  classes, currentPath, menuItems,
}) => (
  <Drawer variant="permanent" className={classes.root} classes={{ paper: classes.drawerPaper }}>
    <div className={classes.toolbar} />
    <nav>
      <List>
        {menuItems.map(({
          disabled, label, href, Icon,
        }) => {
          if (!href) {
            return <ListSubheader key={label}>{label}</ListSubheader>;
          }

          const isSelected = href.length === 1
            ? currentPath === href
            : currentPath.includes(href);

          return (
            <Link key={`${label}-${href}`} href={href} passHref>
              <ListItem button disabled={disabled} selected={isSelected}>
                <ListItemIcon><Icon /></ListItemIcon>
                <ListItemText primary={label} />
              </ListItem>
            </Link>
          );
        })}
      </List>
    </nav>
  </Drawer>
);

MenuDrawer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  currentPath: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
    Icon: PropTypes.func,
  })).isRequired,
};

export default withStyles(styles)(MenuDrawer);
