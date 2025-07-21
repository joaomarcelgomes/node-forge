import ReactFlow, { Handle, Position } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

function CircleNode({ data }) {
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: '#6d15d3ff',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      border: '2px solid black',
      position: 'relative'
    }}>
      {data.label}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

const nodeTypes = { circle: CircleNode };

export default function Graph() {
  const { nodes, edges } = generateRandomGraph(50, 100);
  
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView />
    </div>
  );
}

function generateRandomGraph(vertexCount, edgeCount) {
  const nodes = Array.from({ length: vertexCount }, (_, i) => ({
    id: `${i + 1}`,
    type: 'circle',
    position: { x: Math.random() * 800, y: Math.random() * 600 },
    data: { label: `${i + 1}` },
  }));

  const edges = [];
  while (edges.length < edgeCount) {
    const source = `${Math.ceil(Math.random() * vertexCount)}`;
    let target = `${Math.ceil(Math.random() * vertexCount)}`;
    while (target === source) target = `${Math.ceil(Math.random() * vertexCount)}`;

    edges.push({
      id: `e${source}-${target}-${edges.length}`,
      source,
      target,
    });
  }

  return { nodes, edges };
}
