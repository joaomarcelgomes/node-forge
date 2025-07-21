import { useState } from 'react';
import './app.css'
import Graph from "./components/graphComponent.js";
import ToolBarComponent from "./components/toolBarComponent.js";

function App() {
  const [graphKey, setGraphKey] = useState(0);

  return (
    <div className="background">
      <header>
        <Graph key={graphKey} />
        <ToolBarComponent onRefresh={() => setGraphKey(prev => prev + 1)} />
      </header>
    </div>
  );
}



export default App;
