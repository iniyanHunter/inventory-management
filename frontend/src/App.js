import React, { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.text())
      .then(text => setMsg(text))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>{msg || 'Loading...'}</h1>
    </div>
  );
}

export default App;