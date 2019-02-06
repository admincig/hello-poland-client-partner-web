import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from 'next/link';

const MenuDrawer = ({
  menuItems, currentPath, ...props
}) => {
  const { onClose } = props;

  return (
    <Drawer variant="temporary" {...props}>
      <nav>
        <List>
          {menuItems.map(({
            label, href, Icon, ...other
          }) => (
            <li key={label}>
              mordo
              <Link href={href} passHref prefetch={!other.disabled}>
                <ListItem button component="a" selected={currentPath === href} onClick={onClose} {...other}>
                  {Icon
                    && <Icon color="action" />
                  }
                  <ListItemText primary={label} />
                </ListItem>
              </Link>
            </li>
          ))}
        </List>
      </nav>
    </Drawer>
  );
};

MenuDrawer.propTypes = {
  currentPath: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    Icon: PropTypes.func.isRequired,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};

MenuDrawer.defaultProps = {

};

export default MenuDrawer;
