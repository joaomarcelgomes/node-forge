import React, { forwardRef, useImperativeHandle } from 'react';
import ReactFlow, { Handle, Position } from 'react-flow-renderer';
import dagre from 'dagre';
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

const Graph = forwardRef(({ type }, ref) => {
  let nodes, edges;

  let vert = 50;
  let ares = 100;

  if (type === "Simples") {
    ({ nodes, edges } = generateRandomGraph(vert, ares));
  } else if (type === "MST") {
    ({ nodes, edges } = generateMSTGraph(vert));
  } else if (type === "Dijkstra") {
    ({ nodes, edges } = generateDijkstraGraph(vert));
  } else if (type === "Kruskal"){
    ({ nodes, edges } = generateKruskalGraph(vert));
  } else if (type === "BellmanFord"){
    ({ nodes, edges } = generateBellmanFordGraph(vert));
  } else {
    ({ nodes, edges } = generateRandomGraph(vert, ares));
  }

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: 40, height: 40 });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes = nodes.map(node => {
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      draggable: true,
      position: { x: pos.x, y: pos.y },
      style: { position: 'absolute' }
    };
  });

  useImperativeHandle(ref, () => ({ nodes, edges }), [nodes, edges]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView />
    </div>
  );
});

function generateRandomGraph(vertexCount, edgeCount) {
  const nodes = Array.from({ length: vertexCount }, (_, i) => ({
    id: `${i + 1}`,
    type: 'circle',
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

function generateMSTGraph(vertexCount) {
  const nodes = Array.from({ length: vertexCount }, (_, i) => ({
    id: `${i}`,
    type: 'circle',
    data: { label: `${i}` }
  }));

  const edges = [];
  const connected = new Set();
  connected.add("0");

  for (let i = 1; i < vertexCount; i++) {
    const from = `${Math.floor(Math.random() * i)}`;
    const to = `${i}`;
    const weight = Math.floor(Math.random() * 20) + 1;
    edges.push({ source: from, target: to, weight });
  }

  let extraEdges = vertexCount;
  while (extraEdges > 0) {
    const u = `${Math.floor(Math.random() * vertexCount)}`;
    const v = `${Math.floor(Math.random() * vertexCount)}`;
    if (u !== v && !edges.some(e => (e.source === u && e.target === v) || (e.source === v && e.target === u))) {
      const weight = Math.floor(Math.random() * 20) + 1;
      edges.push({ source: u, target: v, weight });
      extraEdges--;
    }
  }

  const mst = [];
  const visited = new Set();
  const heap = [];
  visited.add("0");

  for (const e of edges) {
    if (e.source === "0" || e.target === "0") {
      heap.push({ ...e, w: e.weight });
    }
  }

  while (heap.length > 0 && visited.size < vertexCount) {
    heap.sort((a, b) => a.w - b.w);
    const e = heap.shift();
    const u = e.source, v = e.target;

    if (visited.has(u) && visited.has(v)) continue;

    const next = visited.has(u) ? v : u;
    visited.add(next);
    mst.push(e);

    for (const ne of edges) {
      if (
        (ne.source === next && !visited.has(ne.target)) ||
        (ne.target === next && !visited.has(ne.source))
      ) {
        heap.push({ ...ne, w: ne.weight });
      }
    }
  }

  const finalEdges = mst.map((e, i) => ({
    id: `e${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
    label: `${e.weight}`
  }));

  return { nodes, edges: finalEdges };
}


function generateDijkstraGraph(vertexCount) {
  const nodes = Array.from({ length: vertexCount }, (_, i) => ({
    id: `${i}`,
    type: 'circle',
    data: { label: `${i}` }
  }));

  const edges = [];
  const adjacency = {};

  for (let i = 0; i < vertexCount; i++) {
    adjacency[i] = [];
  }

  for (let i = 0; i < vertexCount; i++) {
    for (let j = i + 1; j < vertexCount; j++) {
      if (Math.random() < 0.3) {
        const weight = Math.floor(Math.random() * 9) + 1;
        edges.push({ source: `${i}`, target: `${j}`, weight });
        adjacency[i].push({ to: j, weight });
        adjacency[j].push({ to: i, weight });
      }
    }
  }

  const dist = Array(vertexCount).fill(Infinity);
  const prev = Array(vertexCount).fill(null);
  dist[0] = 0;

  const visited = new Set();

  while (visited.size < vertexCount) {
    let u = -1;
    for (let i = 0; i < vertexCount; i++) {
      if (!visited.has(i) && (u === -1 || dist[i] < dist[u])) {
        u = i;
      }
    }

    if (dist[u] === Infinity) break;
    visited.add(u);

    for (const edge of adjacency[u]) {
      const alt = dist[u] + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = u;
      }
    }
  }

  const dijkstraEdges = [];
  for (let i = 0; i < vertexCount; i++) {
    if (prev[i] !== null) {
      const u = `${prev[i]}`;
      const v = `${i}`;
      const weight = adjacency[prev[i]].find(e => e.to === i)?.weight || 1;
      dijkstraEdges.push({
        id: `e${u}-${v}`,
        source: u,
        target: v,
        label: `${weight}`
      });
    }
  }

  return { nodes, edges: dijkstraEdges };
}

function generateKruskalGraph(vertexCount) {
  const nodes = Array.from({ length: vertexCount }, (_, i) => ({
    id: `${i}`,
    type: 'circle',
    data: { label: `${i}` }
  }));

  const allEdges = [];
  for (let i = 0; i < vertexCount; i++) {
    for (let j = i + 1; j < vertexCount; j++) {
      if (Math.random() < 0.3) {
        const weight = Math.floor(Math.random() * 20) + 1;
        allEdges.push({ source: `${i}`, target: `${j}`, weight });
      }
    }
  }

  const parent = Array(vertexCount).fill(0).map((_, i) => i);
  function find(u) {
    if (parent[u] !== u) parent[u] = find(parent[u]);
    return parent[u];
  }
  function union(u, v) {
    const pu = find(u), pv = find(v);
    if (pu !== pv) parent[pu] = pv;
  }

  const mst = [];
  allEdges.sort((a, b) => a.weight - b.weight);
  for (const edge of allEdges) {
    const u = parseInt(edge.source), v = parseInt(edge.target);
    if (find(u) !== find(v)) {
      union(u, v);
      mst.push(edge);
    }
    if (mst.length === vertexCount - 1) break;
  }

  const finalEdges = mst.map((e, i) => ({
    id: `e${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
    label: `${e.weight}`
  }));

  return { nodes, edges: finalEdges };
}

function generateBellmanFordGraph(vertexCount) {
  const nodes = Array.from({ length: vertexCount }, (_, i) => ({
    id: `${i}`,
    type: 'circle',
    data: { label: `${i}` }
  }));

  const edges = [];
  const edgeList = [];

  for (let i = 0; i < vertexCount; i++) {
    for (let j = 0; j < vertexCount; j++) {
      if (i !== j && Math.random() < 0.25) {
        const weight = Math.floor(Math.random() * 21) - 10; 
        edgeList.push({ source: `${i}`, target: `${j}`, weight });
      }
    }
  }

  const dist = Array(vertexCount).fill(Infinity);
  const prev = Array(vertexCount).fill(null);
  dist[0] = 0;

  for (let i = 1; i < vertexCount; i++) {
    for (const { source, target, weight } of edgeList) {
      const u = parseInt(source), v = parseInt(target);
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        prev[v] = u;
      }
    }
  }

  const bellmanEdges = [];
  for (let i = 0; i < vertexCount; i++) {
    if (prev[i] !== null) {
      const u = `${prev[i]}`;
      const v = `${i}`;
      const weight = edgeList.find(e => e.source === u && e.target === v)?.weight ?? 0;
      bellmanEdges.push({
        id: `e${u}-${v}`,
        source: u,
        target: v,
        label: `${weight}`
      });
    }
  }

  return { nodes, edges: bellmanEdges };
}


export default Graph;