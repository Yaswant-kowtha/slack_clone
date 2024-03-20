import React from 'react';
import Body from './components/Body'; // Assuming Body.js is in a components folder
import { Provider } from 'react-redux';
import appStore from './utils/appStore.js';

function App() {
  return (
    <div className="App">
      <Provider store={appStore}>
      <Body />
      </Provider>
    </div>
  );
}

export default App;
