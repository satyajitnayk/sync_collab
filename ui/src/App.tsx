import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  // useEffect to make a GET request when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8080/ping')
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // The empty dependency array ensures the effect runs only once on mount

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
      </header>
    </div>
  );
}

export default App;
