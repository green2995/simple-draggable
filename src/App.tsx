import React from 'react';
import logo from './logo.svg';
import './App.css';
import Draggable, { Coordinate } from './components/Draggable';
import Box, { BoxRef } from './components/Box';

function App() {
  const boxRef = React.useRef<BoxRef>(null);

  function onDrag(e: MouseEvent, uv: Coordinate) {
    if (!boxRef.current) return;
    const {x, y, z} = boxRef.current.defaultRotation

    boxRef.current.setRotation(
      x + uv.y * 120,
      y,
      z + uv.x * 120,
    );

  }

  function onRecover(uv: Coordinate) {
    if (!boxRef.current) return;
    const {x, y, z} = boxRef.current.defaultRotation
    boxRef.current.setRotation(
      x + uv.y * 120,
      y,
      z + uv.x * 120,
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <Draggable
          recoverOnDrop
          onRecover={onRecover}
          onDrag={onDrag}
          padding={50}
        >
          <Box ref={boxRef} />
        </Draggable>
        <p>
          Drag and drop the box!
        </p>
        <a
          className="App-link"
          href="https://www.notion.so/MSG-4cb4bd7436bc47b090efd9867f1336d2"
          target="_blank"
          rel="noopener noreferrer"
        >
          made by MSG
        </a>
      </header>
    </div>
  );
}

export default App;
