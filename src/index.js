import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'

import App, { contactsApp } from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

const store = createStore(contactsApp, undefined, autoRehydrate({ log: true }));

persistStore(store); //.purge();

ReactDOM.render(
  // uggh - provider does nothing in pf mode
  <Provider store={store}>
    <App store={store} />
  </Provider>,

  document.getElementById('root')
);
