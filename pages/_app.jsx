import React from 'react';
import App, { Container } from 'next/app';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import NProgressBar from '@material-ui/docs/NProgressBar';
import NProgress from 'nprogress';
import Router from 'next/router';
import getPageContext from 'src/getPageContext';
import withReduxStore from 'services/redux/withReduxStore';
import { Provider } from 'react-redux';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};


class MyApp extends App {
  constructor(props, context) {
    super(props, context);
    this.pageContext = this.props.pageContext || getPageContext();
  }

  pageContext = null;

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        {/* Wrap every page in redux store Provider */}
        <Provider store={reduxStore}>
          {/* Wrap every page in Jss and Theme providers */}
          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >
            {/* MuiThemeProvider makes the theme available down the React tree, */}
            <MuiThemeProvider
              theme={this.pageContext.theme}
              sheetsManager={this.pageContext.sheetsManager}
            >
              <NProgressBar />
              {/* CssBaseline kickstart an elegant, consistent,
                  and simple baseline to build upon. */}
              <CssBaseline />
              {/* Pass pageContext to the _document through the renderPage enhancer
                  to render collected styles on server side. */}
              <Component pageContext={this.pageContext} {...pageProps} />
            </MuiThemeProvider>
          </JssProvider>
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
