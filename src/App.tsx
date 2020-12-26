import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { isLoggedInVar } from './apollo';
import { LoggedOutRouter } from './routers/logged-out-router';


function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedOutRouter /> : <LoggedOutRouter />;
}

export default App;
