import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './providers/UserProvider';
// import { ErrorBoundary } from './components/ErrorBoundary';

import {
  gripApp,
  getKeplrAccountProvider
} from '@stakeordie/griptape.js';

const config = {
  restUrl: 'https://pulsar-2.api.trivium.network:1317',
  defaultFees: {
    upload: 500000,
    init: 100000,
    exec: 200000,
    send: 100000
  }
};
const provider = getKeplrAccountProvider();

function runApp() {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      {/* <ErrorBoundary> */}
        <UserProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserProvider>
        {/* </ErrorBoundary> */}
    </React.StrictMode>
  );
}


gripApp(config, provider, runApp);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
