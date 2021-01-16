import React from 'react';
import './App.css';

function App() {
  return (
    <div className="login-container">
      <div className="login-content">
        <label>
          Nome usuário
      </label>
        <br />
        <input
          type="text" />
        <br />
        <label>
          Senha
      </label>
        <br />
        <input
          type="password" />
      </div>
    </div>
  );
}

export default App;
