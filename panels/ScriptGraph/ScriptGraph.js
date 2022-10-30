import { useCallback, useMemo, useState } from 'react';
import ReactFlow, { Background, applyEdgeChanges, applyNodeChanges, addEdge, ConnectionLineType } from 'reactflow';
import 'reactflow/dist/style.css';
import ScriptNode from '../../components/node/ScriptNode.js';

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    type: 'script',
    data: {
      label: 'NODE LABEL',
      category: 'logic',
      inputs: [
        {
          label: 'true',
          type: 'boolean'
        },
        {
          label: 'false',
          type: 'boolean'
        }
      ],
      outputs: [
        {
          label: 'result',
          type: 'any'
        }
      ],
      variables: [
        {
          type: 'number',
          default: 19,
          label: 'Amount'
        }]
    }
  },
  {
    id: '2',
    position: { x: 100, y: 250 },
    type: "script",
    data: {
      label: 'NODE LABEL',
      inputs: [
        {
          label: 'input1',
          type: 'boolean'
        },
        {
          label: 'input2',
          type: 'string'
        }
      ],
      outputs: [
        {
          label: 'result',
          type: 'any'
        }
      ],
      variables: []
    }
  },
];

const initialEdges = [
  // {
  //   id: '1-2',
  //   source: '1',
  //   target: '2',
  //   label: 'something',
  // }
]

export default function ScriptGraph() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodeChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [])
  const onEdgeChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])

  const nodeTypes = useMemo(() => ({ script: ScriptNode }), []);

  return (
    <div className="grow h-full w-full bg-cellbg">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        onConnect={onConnect}
        disableKeyboardA11y={true}
      >
        <Background
          variant="dots"
          color="#202020"
          size={3}
          gap={30}
        />
      </ReactFlow>
    </div>
  );
}
