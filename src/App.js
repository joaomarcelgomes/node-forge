import { useState, useRef } from 'react';
import './app.css'
import Graph from "./components/graphComponent.js";
import ToolBarComponent from "./components/toolBarComponent.js";

function App() {
  const [graphKey, setGraphKey] = useState(0);
  const [graphType, setGraphType] = useState("Simples");
  const graphRef = useRef();

  function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const handleDownload = () => {
    if (graphRef.current) {
      const cleanNodes = graphRef.current.nodes.map(({ id, data }) => ({
        id,
        label: data.label
      }));

      const cleanEdges = graphRef.current.edges.map(({ source, target, label }) => ({
        source,
        target,
        weight: label ? parseInt(label) : undefined
      }));

      const data = { nodes: cleanNodes, edges: cleanEdges };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateGUID() + '.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="background">
      <header>
        <Graph key={graphKey} type={graphType} ref={graphRef} />
        <ToolBarComponent 
          onRefresh={() => setGraphKey(prev => prev + 1)}
          onSelectChange={(value) => setGraphType(value)} 
          onDownload={handleDownload}
        />
      </header>
    </div>
  );
}



export default App;
