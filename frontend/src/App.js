import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  const fetchMessage = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/hello');
      setMessage(response.data);
    } catch (error) {
      console.error('Error fetching message:', error);
      setMessage('Error fetching message');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Frontend Application</h1>
        <button onClick={fetchMessage}>Get Message</button>
        {message && <p className="message">{message}</p>}
      </header>
    </div>
  );
}

export default App;