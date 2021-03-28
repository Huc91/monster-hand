import React, { useState } from 'react';

import HandPose from './HandPose';

import './App.css';

function App() {
  const [isLoading, setLoading] = useState(true);

  const handleLoading = () => {
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="app__header">Monster Hand</header>
      <div className="app__loader">{isLoading ? 'Loading model...' : ''}</div>
      <div className="app__tutorial">
        Use your hand to bite
        <div className="tutorial__icon" />
      </div>
      <HandPose sendLoading={handleLoading} isLoading={isLoading} />
      <div className="app__credits">Luca Ucciero 2021</div>
    </div>
  );
}

export default App;
