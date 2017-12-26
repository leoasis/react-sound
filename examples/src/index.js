import React from 'react';
import ReactDOM from 'react-dom';
import Example from './Example';
import { AppContainer } from 'react-hot-loader'

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>
  , document.getElementById('app'));
}


render(Example);

if (module.hot) {
  module.hot.accept('./Example', () => {
    const { default: Example } = require('./Example');
    render(Example);
  })
}
