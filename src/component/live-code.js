import React, { useState, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import Editor from '@monaco-editor/react';

const LiveCode = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [roomId, setRoomId] = useState('');
  const editorRef = useRef(null);
  const ydocRef = useRef(null);
  const providerRef = useRef(null);

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      if (providerRef.current) providerRef.current.destroy();
      if (ydocRef.current) ydocRef.current.destroy();
    };
  }, []);

  const joinRoom = () => {
    if (roomId.trim()) {
      // Cleanup previous connections if any
      if (providerRef.current) providerRef.current.destroy();
      if (ydocRef.current) ydocRef.current.destroy();

      // Initialize Yjs document
      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;

      // Initialize WebSocket provider with the specified roomId
      const provider = new WebsocketProvider('ws://localhost:9999', roomId, ydoc);
      providerRef.current = provider;

      // Set connection status based on WebSocket connection
      provider.on('status', (event) => {
        setConnectionStatus(event.status === 'connected' ? 'Connected' : 'Disconnected');
      });

      // Get a shared Yjs text instance
      const yText = ydoc.getText('monaco');

      // Monaco editor instance
      const editor = editorRef.current;
      if (editor) {
        const model = editor.getModel();
        if (model) {
          // Bind Yjs text instance to Monaco editor for collaborative editing
          new MonacoBinding(yText, model, provider.awareness, editor);
        }
      }
    }
  };

  return (
    <div>
      <h2>Live Code Editor</h2>
      <p>Status: {connectionStatus}</p>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      <div style={{ height: '400px', border: '1px solid #ccc', marginTop: '10px' }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          onMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>
    </div>
  );
};

export default LiveCode;
