import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
// import 'react-form-builder2/node_modules/react-datepicker/dist/react-datepicker.css';
import './index.scss';
import './i18n/i18n';
import 'jquery';
import 'bootstrap-slider/dist/css/bootstrap-slider.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
    {/* </ErrorBoundary> */}
  </React.StrictMode>
);
