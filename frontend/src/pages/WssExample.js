import React, { useEffect, useState, useRef } from 'react';

function WssExample() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000'); // ✅ Save directly to ws.current
    ws.current.onmessage =async (event) => {
        console.log("...event",event.data);
        
        if (event.data instanceof Blob) {
            const text = await event.data.text();
            setMessages(prev => [...prev, text]);
          } else {
            setMessages(prev => [...prev, event.data]);
          }
    };

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.current.close();
    };
  }, []);
const closeWebSocket = () => {
    ws.current.close()
}
  const sendMessage = () => {    
    if (input && ws.current?.readyState === WebSocket.OPEN) {
      ws.current?.send(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>WebSocket Chat</h2>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter message"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={closeWebSocket}>close</button>

      <div style={{ marginTop: '20px' }}>
        <h4>Messages:</h4>
        {console.log("....messages",messages)}
        {messages?.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
    </div>
  );
}

export default WssExample;
