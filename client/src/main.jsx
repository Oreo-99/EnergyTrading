import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { Sepolia , Holesky} from "@thirdweb-dev/chains";

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

//Sepolia is the chain id of the chain you want to connect to
//clientId is the client id of the application you created on the thirdweb dashboard
root.render(
  <ThirdwebProvider activeChain={Holesky} clientId={import.meta.env.VITE_CLIENT_ID} > 
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)