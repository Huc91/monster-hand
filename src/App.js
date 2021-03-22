import React, { useState } from 'react';

import HandPose from './HandPose';

import './App.css';

function App() {
  const [isLoading, setLoading] = useState(true);

  const handleLoading = () => {
    setLoading(false);
  }

  return (
    <div className="App">
      <header className="App-header">Monster Hand</header>
      <div className="Loading">
        { isLoading ? 'Loading model...' : ''}
      </div>
      <div className="Info">
        Use your hand to bite
        <div className="InfoIcon" />
      </div>
      <HandPose sendLoading={ handleLoading }/>
      <div className="Payoff">
        Luca Ucciero 2021
      </div>
    </div>
  );
}

export default App;
