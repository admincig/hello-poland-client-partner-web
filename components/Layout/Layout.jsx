import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Content from './Content';
import Header from './Header';
import MenuDrawer from './MenuDrawer';

const MENU_ITEMS = [];

class Layout extends Component {
  state = {
    isMenuOpened: false,
  };

  openMenu = () => {
    this.setState({
      isMenuOpened: true,
    });
  };

  closeMenu = () => {
    this.setState({
      isMenuOpened: false,
    });
  };

  render() {
    const { HeaderProps, children, router } = this.props;
    const { isMenuOpened } = this.state;

    return (
      <React.Fragment>
        <Header onMenuButtonClick={this.openMenu} {...HeaderProps} />
        <Content>
          {MENU_ITEMS.length
            ? (
              <MenuDrawer
                menuItems={MENU_ITEMS}
                open={isMenuOpened}
                onClose={this.closeMenu}
                currentPath={router.asPath}
              />
            )
            : null
          }
          {children}
        </Content>
      </React.Fragment>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  HeaderProps: PropTypes.shape({}),
  router: PropTypes.shape({}).isRequired,
};

Layout.defaultProps = {
  HeaderProps: {},
};

export default withRouter(Layout);
