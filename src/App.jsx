import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  ArrowRight, 
  GitBranch, 
  Share2, 
  Database, 
  Trash2, 
  Plus, 
  Play, 
  RotateCcw,
  Search,
  X,
  Hash,
  List
} from 'lucide-react';

/**
 * UTILITY FUNCTIONS & CONSTANTS
 */
const ANIMATION_DELAY = 600;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const COLORS = {
  primary: 'bg-indigo-600',
  secondary: 'bg-emerald-500',
  accent: 'bg-amber-500',
  danger: 'bg-rose-500',
  nodeBase: 'bg-slate-800 border-2 border-slate-600',
  nodeActive: 'bg-indigo-600 border-indigo-400',
  nodeHighlight: 'bg-emerald-600 border-emerald-400',
  nodeVisiting: 'bg-amber-600 border-amber-400', // For traversal
};

// Generic Control Button Component
const Button = ({ onClick, children, variant = 'primary', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    neutral: 'bg-slate-700 hover:bg-slate-600 text-gray-200',
    outline: 'bg-transparent border border-slate-600 hover:bg-slate-800 text-gray-300'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Input Field Component
const Input = ({ value, onChange, placeholder, type = 'number', onKeyDown }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 w-full sm:w-48"
  />
);

/**
 * VISUALIZATION COMPONENTS
 */

// --- STACK VISUALIZATION ---
const StackViz = () => {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Stack is empty');
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const handlePush = () => {
    if (!inputValue) return;
    if (stack.length >= 8) {
      setMessage('Stack Overflow! (Max 8 items for demo)');
      return;
    }
    const newItem = { id: Date.now(), value: inputValue };
    setStack((prev) => [...prev, newItem]);
    setInputValue('');
    setMessage(`Pushed ${inputValue}`);
    setHighlightIndex(stack.length);
    setTimeout(() => setHighlightIndex(-1), ANIMATION_DELAY);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage('Stack Underflow!');
      return;
    }
    const popped = stack[stack.length - 1];
    setHighlightIndex(stack.length - 1);
    setMessage(`Popping ${popped.value}...`);
    
    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
      setHighlightIndex(-1);
      setMessage(`Popped ${popped.value}`);
    }, ANIMATION_DELAY);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty');
      return;
    }
    setHighlightIndex(stack.length - 1);
    setMessage(`Top element is ${stack[stack.length - 1].value}`);
    setTimeout(() => setHighlightIndex(-1), 1000);
  };

  const clear = () => {
    setStack([]);
    setMessage('Stack cleared');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Enter value" 
            onKeyDown={(e) => e.key === 'Enter' && handlePush()}
          />
          <Button onClick={handlePush} variant="primary"><Plus size={18} /> Push</Button>
          <Button onClick={handlePop} variant="danger" disabled={stack.length === 0}><ArrowRight size={18} className="rotate-90" /> Pop</Button>
          <Button onClick={handlePeek} variant="secondary" disabled={stack.length === 0}><Search size={18} /> Peek</Button>
        </div>
        <Button onClick={clear} variant="outline"><RotateCcw size={18} /> Reset</Button>
      </div>

      <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-8">
        <div className="absolute top-4 left-4 text-slate-400 font-mono text-sm bg-slate-900/50 p-2 rounded border border-slate-800">{message}</div>
        
        {/* Stack Container */}
        <div className="relative w-48 border-l-4 border-r-4 border-b-4 border-slate-700 min-h-[400px] flex flex-col-reverse justify-start items-center bg-slate-900/30 rounded-b-xl p-2 gap-2 transition-all">
           <div className="absolute -left-16 bottom-0 text-slate-500 font-mono text-xs">Index 0</div>
           
           {stack.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-medium">Empty Stack</div>
           )}

           {stack.map((item, index) => (
             <div 
                key={item.id}
                className={`w-full h-12 flex items-center justify-center rounded-md font-bold text-lg shadow-lg transition-all duration-500 transform
                  ${highlightIndex === index ? COLORS.nodeHighlight : COLORS.nodeActive} text-white
                `}
                style={{
                  animation: highlightIndex === index ? 'pulse 0.5s' : 'slideDown 0.3s ease-out'
                }}
             >
               {item.value}
               {index === stack.length - 1 && (
                 <span className="absolute -right-24 text-blue-400 text-sm font-mono flex items-center">
                   ← Top
                 </span>
               )}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- QUEUE VISUALIZATION ---
const QueueViz = () => {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Queue is empty');
  const [animating, setAnimating] = useState(false);

  const handleEnqueue = () => {
    if (!inputValue || animating) return;
    if (queue.length >= 7) {
      setMessage('Queue Full! (Limit for demo)');
      return;
    }
    const newItem = { id: Date.now(), value: inputValue, isNew: true };
    setQueue((prev) => [...prev, newItem]);
    setInputValue('');
    setMessage(`Enqueued ${inputValue}`);
    
    // Remove isNew flag after animation
    setTimeout(() => {
        setQueue(prev => prev.map(item => ({...item, isNew: false})));
    }, ANIMATION_DELAY);
  };

  const handleDequeue = () => {
    if (queue.length === 0 || animating) {
      setMessage('Queue Underflow!');
      return;
    }
    
    setAnimating(true);
    const item = queue[0];
    setMessage(`Dequeueing ${item.value}...`);
    
    // Mark first item for deletion animation
    setQueue(prev => prev.map((q, i) => i === 0 ? { ...q, isLeaving: true } : q));

    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      setAnimating(false);
      setMessage(`Dequeued ${item.value}`);
    }, ANIMATION_DELAY);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Enter value"
            onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
          />
          <Button onClick={handleEnqueue} variant="primary"><Plus size={18} /> Enqueue</Button>
          <Button onClick={handleDequeue} variant="danger" disabled={queue.length === 0}><ArrowRight size={18} /> Dequeue</Button>
        </div>
        <Button onClick={() => setQueue([])} variant="outline"><RotateCcw size={18} /> Reset</Button>
      </div>

      <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-8">
        <div className="absolute top-4 left-4 text-slate-400 font-mono text-sm bg-slate-900/50 p-2 rounded border border-slate-800">{message}</div>
        
        {/* Queue Container */}
        <div className="w-full max-w-4xl min-h-[150px] border-t-2 border-b-2 border-slate-700 border-dashed flex items-center px-4 overflow-x-auto gap-4 relative">
           <div className="absolute left-2 -top-8 text-emerald-500 font-mono text-sm font-bold">FRONT (Dequeue)</div>
           <div className="absolute right-2 -top-8 text-blue-500 font-mono text-sm font-bold">REAR (Enqueue)</div>

           {queue.length === 0 && (
             <div className="w-full text-center text-slate-600">Empty Queue</div>
           )}

           {queue.map((item, index) => (
             <div 
                key={item.id}
                className={`flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-xl border-4
                  ${item.isNew ? 'bg-blue-600 border-blue-400 scale-0 animate-popIn' : ''}
                  ${item.isLeaving ? 'bg-rose-600 border-rose-400 opacity-0 -translate-x-full' : 'bg-slate-800 border-slate-600'}
                `}
                style={{
                  transition: 'all 0.5s ease'
                }}
             >
               {item.value}
               <div className="absolute -bottom-6 text-xs text-slate-500 font-mono">{index}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- LINKED LIST VISUALIZATION ---
const LinkedListViz = () => {
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const insertHead = () => {
    if (!inputValue) return;
    const newNode = { id: Date.now(), value: inputValue, next: null };
    setList([newNode, ...list]);
    setInputValue('');
  };

  const insertTail = () => {
    if (!inputValue) return;
    const newNode = { id: Date.now(), value: inputValue, next: null };
    setList([...list, newNode]);
    setInputValue('');
  };

  const removeHead = () => {
    if (list.length === 0) return;
    setList(list.slice(1));
  };

  const removeTail = () => {
    if (list.length === 0) return;
    setList(list.slice(0, -1));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Value"
          />
          <Button onClick={insertHead} variant="primary">Add Head</Button>
          <Button onClick={insertTail} variant="primary">Add Tail</Button>
          <Button onClick={removeHead} variant="danger" disabled={list.length===0}>Del Head</Button>
          <Button onClick={removeTail} variant="danger" disabled={list.length===0}>Del Tail</Button>
        </div>
        <Button onClick={() => setList([])} variant="outline"><RotateCcw size={18} /> Clear</Button>
      </div>

      <div className="flex-1 bg-slate-950 overflow-auto flex items-center p-8">
        <div className="flex items-center flex-wrap gap-0">
          <div className="mr-4 text-emerald-400 font-mono font-bold">HEAD</div>
          {list.length === 0 ? (
            <div className="text-slate-600 italic">Null</div>
          ) : (
            list.map((node, idx) => (
              <div key={node.id} className="flex items-center animate-slideInRight">
                 <div className="w-24 h-16 bg-slate-800 border-2 border-indigo-500 rounded-lg flex">
                    <div className="w-2/3 flex items-center justify-center border-r border-indigo-500 text-white font-bold text-lg">
                      {node.value}
                    </div>
                    <div className="w-1/3 bg-indigo-900/30 flex items-center justify-center text-indigo-300 text-xs">
                      Next
                    </div>
                 </div>
                 {/* Pointer Arrow */}
                 <div className="px-2 text-indigo-500">
                    <ArrowRight size={24} />
                 </div>
                 {idx === list.length - 1 && (
                   <div className="text-slate-500 font-mono">NULL</div>
                 )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- BST VISUALIZATION ---
class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = 0;
    this.y = 0;
  }
}

const BSTViz = () => {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [nodes, setNodes] = useState([]); 
  const [edges, setEdges] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [message, setMessage] = useState('Ready to insert');
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to re-calculate positions
  const updateTreePositions = (node, level = 0, offset = 0, parentX = 50) => {
    if (!node) return;
    const spread = 20 / Math.pow(2, Math.max(0, level - 1)); // Adjusted spread
    
    if (level === 0) {
      node.x = 50;
      node.y = 10;
    } else {
      node.x = parentX + offset * spread;
      node.y = level * 15 + 10;
    }

    updateTreePositions(node.left, level + 1, -1, node.x);
    updateTreePositions(node.right, level + 1, 1, node.x);
  };

  const traverseAndFlatten = (node, nodeList = [], edgeList = []) => {
    if (!node) return;
    nodeList.push({ id: node.id, value: node.value, x: node.x, y: node.y });
    
    if (node.left) {
      edgeList.push({ id: `${node.id}-${node.left.id}`, x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y });
      traverseAndFlatten(node.left, nodeList, edgeList);
    }
    if (node.right) {
      edgeList.push({ id: `${node.id}-${node.right.id}`, x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y });
      traverseAndFlatten(node.right, nodeList, edgeList);
    }
    return { nodeList, edgeList };
  };

  const refreshTree = (rootNode) => {
    updateTreePositions(rootNode);
    const flat = traverseAndFlatten(rootNode);
    if (flat) {
      setNodes(flat.nodeList);
      setEdges(flat.edgeList);
    } else {
      setNodes([]);
      setEdges([]);
    }
  };

  const insertStepByStep = async (value) => {
    const newVal = parseInt(value);
    if (isNaN(newVal)) return;
    
    setIsProcessing(true);
    const newNode = new BSTNode(newVal);

    if (!root) {
      setMessage(`Root is null. Inserting ${newVal} as root.`);
      await sleep(ANIMATION_DELAY);
      setRoot(newNode);
      refreshTree(newNode);
      setIsProcessing(false);
      setMessage(`Inserted ${newVal}.`);
      return;
    }

    let current = root;
    setMessage(`Starting search at Root: ${current.value}`);
    setActiveNodeId(current.id);
    await sleep(ANIMATION_DELAY);

    while (true) {
      if (newVal === current.value) {
        setMessage(`Value ${newVal} already exists!`);
        setActiveNodeId(null);
        setIsProcessing(false);
        return;
      }

      if (newVal < current.value) {
        setMessage(`${newVal} < ${current.value}. Go Left.`);
        await sleep(ANIMATION_DELAY);
        
        if (!current.left) {
          setMessage(`Left child found empty. Inserting ${newVal}.`);
          current.left = newNode;
          break;
        }
        current = current.left;
        setActiveNodeId(current.id);
        setMessage(`Visiting Left Node: ${current.value}`);
        await sleep(ANIMATION_DELAY);
      } else {
        setMessage(`${newVal} > ${current.value}. Go Right.`);
        await sleep(ANIMATION_DELAY);

        if (!current.right) {
          setMessage(`Right child found empty. Inserting ${newVal}.`);
          current.right = newNode;
          break;
        }
        current = current.right;
        setActiveNodeId(current.id);
        setMessage(`Visiting Right Node: ${current.value}`);
        await sleep(ANIMATION_DELAY);
      }
    }

    // Finalize
    refreshTree(root);
    setActiveNodeId(null);
    setIsProcessing(false);
    setMessage(`Inserted ${newVal} successfully.`);
  };

  const handleInsert = () => {
    if(isProcessing) return;
    insertStepByStep(inputValue);
    setInputValue('');
  };

  const clear = () => {
    setRoot(null);
    setNodes([]);
    setEdges([]);
    setMessage('Tree cleared');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex gap-4 items-center justify-between">
        <div className="flex gap-2">
           <Input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Number" 
            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
          />
          <Button onClick={handleInsert} disabled={isProcessing}>
            {isProcessing ? 'Inserting...' : 'Insert'}
          </Button>
        </div>
        <Button onClick={clear} variant="outline">Reset Tree</Button>
      </div>
      
      <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-slate-200 font-mono text-sm max-w-md shadow-xl transition-all">
          <span className="text-emerald-400 font-bold">Status:</span> {message}
        </div>

        {/* SVG Layer for edges */}
        <div className="flex-1 relative">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {edges.map(edge => (
                <line 
                    key={edge.id}
                    x1={`${edge.x1}%`} y1={`${edge.y1}%`}
                    x2={`${edge.x2}%`} y2={`${edge.y2}%`}
                    stroke="#475569" strokeWidth="2"
                />
            ))}
            </svg>

            {/* Node Layer */}
            {nodes.map(node => (
            <div
                key={node.id}
                className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-bold shadow-lg transition-all duration-500 z-10
                ${activeNodeId === node.id ? 'bg-amber-500 border-amber-300 scale-125 shadow-amber-500/50' : 'bg-emerald-600 border-emerald-400 text-white'}
                `}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
                {node.value}
            </div>
            ))}
            
            {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                Tree is Empty. Add a number to root.
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- MIN HEAP VISUALIZATION ---
const HeapViz = () => {
  const [heap, setHeap] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Min Heap Empty');
  const [activeIndices, setActiveIndices] = useState([]); // indices being compared/swapped
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to generate tree coordinates from array index
  const getCoords = (index, total) => {
     const level = Math.floor(Math.log2(index + 1));
     const maxLevel = Math.floor(Math.log2(Math.max(total, 1))) + 1;
     // Nodes in this level
     const levelStart = Math.pow(2, level) - 1;
     const positionInLevel = index - levelStart;
     const nodesInLevel = Math.pow(2, level);
     
     // x spread based on inverse of level depth
     const xSlice = 100 / (nodesInLevel + 1);
     const x = xSlice * (positionInLevel + 1);
     const y = (level * 15) + 10;
     return { x, y };
  };

  const insert = async () => {
    const val = parseInt(inputValue);
    if(isNaN(val)) return;
    if(isProcessing) return;
    setIsProcessing(true);

    const newHeap = [...heap, val];
    setHeap(newHeap);
    setInputValue('');
    setMessage(`Added ${val} to end of heap`);
    await sleep(ANIMATION_DELAY);

    // Bubble Up
    let index = newHeap.length - 1;
    while(index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      
      setActiveIndices([index, parentIndex]);
      setMessage(`Comparing ${newHeap[index]} with parent ${newHeap[parentIndex]}`);
      await sleep(ANIMATION_DELAY);

      if(newHeap[index] < newHeap[parentIndex]) {
        setMessage(`${newHeap[index]} < ${newHeap[parentIndex]}, Swapping!`);
        // Swap
        [newHeap[index], newHeap[parentIndex]] = [newHeap[parentIndex], newHeap[index]];
        setHeap([...newHeap]); // Trigger render for swap
        await sleep(ANIMATION_DELAY);
        index = parentIndex;
      } else {
        setMessage('Parent is smaller. Heap property satisfied.');
        break;
      }
    }
    setActiveIndices([]);
    setIsProcessing(false);
  };

  const removeMin = async () => {
    if(heap.length === 0 || isProcessing) return;
    setIsProcessing(true);

    setMessage(`Removing root ${heap[0]}`);
    setActiveIndices([0]);
    await sleep(ANIMATION_DELAY);

    if(heap.length === 1) {
        setHeap([]);
        setMessage('Heap empty');
        setActiveIndices([]);
        setIsProcessing(false);
        return;
    }

    // Move last to root
    const newHeap = [...heap];
    const last = newHeap.pop();
    newHeap[0] = last;
    setHeap([...newHeap]);
    setMessage(`Moved last element ${last} to root`);
    await sleep(ANIMATION_DELAY);

    // Heapify Down
    let index = 0;
    while(true) {
        let leftChildIdx = 2 * index + 1;
        let rightChildIdx = 2 * index + 2;
        let smallest = index;

        if(leftChildIdx < newHeap.length) {
             setActiveIndices([index, leftChildIdx]);
             setMessage(`Comparing ${newHeap[index]} vs Left ${newHeap[leftChildIdx]}`);
             await sleep(ANIMATION_DELAY);
             if(newHeap[leftChildIdx] < newHeap[smallest]) {
                 smallest = leftChildIdx;
             }
        }

        if(rightChildIdx < newHeap.length) {
            setActiveIndices([index, rightChildIdx]);
            setMessage(`Comparing vs Right ${newHeap[rightChildIdx]}`);
            await sleep(ANIMATION_DELAY);
            if(newHeap[rightChildIdx] < newHeap[smallest]) {
                smallest = rightChildIdx;
            }
        }

        if(smallest !== index) {
            setMessage(`Swapping with ${newHeap[smallest]}`);
            [newHeap[index], newHeap[smallest]] = [newHeap[smallest], newHeap[index]];
            setHeap([...newHeap]);
            await sleep(ANIMATION_DELAY);
            index = smallest;
        } else {
            setMessage('Heap restored.');
            break;
        }
    }
    setActiveIndices([]);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 bg-slate-900 border-b border-slate-700 flex gap-4 items-center justify-between">
            <div className="flex gap-2">
                <Input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" onKeyDown={(e) => e.key === 'Enter' && insert()} />
                <Button onClick={insert} disabled={isProcessing}>Insert</Button>
                <Button onClick={removeMin} variant="danger" disabled={isProcessing || heap.length === 0}>Remove Min</Button>
            </div>
            <Button onClick={() => setHeap([])} variant="outline">Reset</Button>
        </div>

        <div className="flex-1 bg-slate-950 flex flex-col p-4 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-20 bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-slate-200 font-mono text-sm max-w-md shadow-xl">
                 <span className="text-purple-400 font-bold">Status:</span> {message}
            </div>

            {/* Tree View */}
            <div className="flex-1 relative border-b border-slate-800 mb-4 min-h-[300px]">
                {/* Edges */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {heap.map((_, i) => {
                        if (i === 0) return null;
                        const parentIdx = Math.floor((i-1)/2);
                        const start = getCoords(parentIdx, heap.length);
                        const end = getCoords(i, heap.length);
                        return <line key={`edge-${i}`} x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`} stroke="#475569" strokeWidth="2" />;
                    })}
                </svg>
                {/* Nodes */}
                {heap.map((val, i) => {
                    const coords = getCoords(i, heap.length);
                    const isActive = activeIndices.includes(i);
                    return (
                        <div key={`node-${i}`} 
                             className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 z-10 border-2
                                ${isActive ? 'bg-amber-600 border-amber-400 scale-125' : 'bg-purple-600 border-purple-400'}
                             `}
                             style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                        >
                            {val}
                        </div>
                    );
                })}
            </div>

            {/* Array View */}
            <div className="h-24 bg-slate-900/50 rounded-xl flex items-center px-4 gap-2 overflow-x-auto border border-slate-800">
                <span className="text-slate-500 font-mono text-xs mr-2">ARRAY:</span>
                {heap.map((val, i) => (
                    <div key={`arr-${i}`} className={`flex flex-col items-center min-w-[3rem]`}>
                        <div className={`w-10 h-10 flex items-center justify-center border-2 rounded font-bold transition-all
                            ${activeIndices.includes(i) ? 'bg-amber-600 border-amber-400' : 'bg-slate-800 border-slate-600'}
                        `}>
                            {val}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">{i}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

// --- HASH MAP VISUALIZATION ---
const HashViz = () => {
    const SIZE = 7;
    const [table, setTable] = useState(Array(SIZE).fill(null).map(() => []));
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('Hash Table Size: 7');
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [isProcessing, setIsProcessing] = useState(false);

    const hash = (key) => key % SIZE;

    const insert = async () => {
        const val = parseInt(inputValue);
        if(isNaN(val) || isProcessing) return;
        setIsProcessing(true);

        const index = hash(val);
        setMessage(`Hashing: ${val} % ${SIZE} = ${index}`);
        setHighlightIndex(index);
        await sleep(1000);

        setMessage(`Inserting ${val} into bucket ${index}`);
        
        setTable(prev => {
            const newTable = [...prev];
            // Check duplicate just for visuals cleanliness
            if(!newTable[index].includes(val)) {
                newTable[index] = [...newTable[index], val];
            }
            return newTable;
        });

        await sleep(500);
        setHighlightIndex(-1);
        setInputValue('');
        setMessage('Ready');
        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 bg-slate-900 border-b border-slate-700 flex gap-4 items-center justify-between">
                <div className="flex gap-2">
                    <Input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Integer Value" onKeyDown={(e) => e.key === 'Enter' && insert()} />
                    <Button onClick={insert} disabled={isProcessing}>Insert</Button>
                </div>
                <Button onClick={() => setTable(Array(SIZE).fill(null).map(() => []))} variant="outline">Clear</Button>
            </div>

            <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
                 <div className="text-center mb-8 text-slate-400 font-mono">{message}</div>
                 
                 <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                     {table.map((bucket, i) => (
                         <div key={i} className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${highlightIndex === i ? 'bg-indigo-900/30 ring-2 ring-indigo-500' : ''}`}>
                             <div className="w-16 h-16 flex-shrink-0 bg-slate-800 border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center font-mono">
                                 <span className="text-xs text-slate-500">INDEX</span>
                                 <span className="text-xl font-bold text-slate-200">{i}</span>
                             </div>
                             
                             <div className="flex-1 flex items-center gap-2 overflow-x-auto min-h-[4rem] p-2 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
                                 {bucket.length === 0 ? <span className="text-slate-600 text-sm italic">Empty</span> : null}
                                 {bucket.map((val, idx) => (
                                     <React.Fragment key={`${i}-${idx}`}>
                                        <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center font-bold shadow-md animate-popIn">
                                            {val}
                                        </div>
                                        {idx < bucket.length - 1 && <div className="w-4 h-1 bg-slate-600"></div>}
                                     </React.Fragment>
                                 ))}
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

// --- GRAPH VISUALIZATION ---
const GraphViz = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mode, setMode] = useState('node'); // 'node' or 'edge'
  const [selectedNode, setSelectedNode] = useState(null);
  
  const canvasRef = useRef(null);

  const handleCanvasClick = (e) => {
    if (mode === 'node') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newNode = {
        id: Date.now(),
        label: nodes.length + 1,
        x,
        y
      };
      setNodes([...nodes, newNode]);
    }
  };

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    if (mode === 'edge') {
      if (selectedNode === null) {
        setSelectedNode(nodeId);
      } else {
        if (selectedNode !== nodeId) {
          // Check if edge already exists
          const exists = edges.some(edge => 
            (edge.from === selectedNode && edge.to === nodeId) || 
            (edge.from === nodeId && edge.to === selectedNode)
          );
          
          if (!exists) {
            setEdges([...edges, { from: selectedNode, to: nodeId, id: Date.now() }]);
          }
        }
        setSelectedNode(null);
      }
    }
  };

  const clear = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex gap-4 items-center justify-between">
         <div className="flex gap-4 items-center">
            <span className="text-slate-400 text-sm font-bold">MODE:</span>
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => { setMode('node'); setSelectedNode(null); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'node' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Add Node
              </button>
              <button 
                onClick={() => setMode('edge')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'edge' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Connect Edge
              </button>
            </div>
            <span className="text-slate-500 text-xs">
              {mode === 'node' ? 'Click on canvas to add node.' : 'Click two nodes to connect.'}
            </span>
         </div>
         <Button onClick={clear} variant="outline"><Trash2 size={16} /> Clear Graph</Button>
      </div>

      <div 
        className="flex-1 bg-slate-950 relative overflow-hidden cursor-crosshair"
        onClick={handleCanvasClick}
        ref={canvasRef}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map(edge => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            return (
              <line 
                key={edge.id}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="#64748b" strokeWidth="3"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <div
            key={node.id}
            onClick={(e) => handleNodeClick(e, node.id)}
            className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center font-bold text-white shadow-lg cursor-pointer transition-transform hover:scale-110
              ${selectedNode === node.id ? 'bg-purple-500 ring-4 ring-purple-900 scale-110' : 'bg-slate-700 border-2 border-slate-500'}
            `}
            style={{ left: node.x, top: node.y }}
          >
            {node.label}
          </div>
        ))}
        
        {nodes.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-slate-600 pointer-events-none">Click to add nodes</div>}
      </div>
    </div>
  );
};

// --- MAIN APP SHELL ---
const App = () => {
  const [activeTab, setActiveTab] = useState('stack');

  const tabs = [
    { id: 'stack', label: 'Stack', icon: Layers },
    { id: 'queue', label: 'Queue', icon: Database },
    { id: 'linkedlist', label: 'Linked List', icon: GitBranch },
    { id: 'bst', label: 'Binary Search Tree', icon: Share2 },
    { id: 'heap', label: 'Min Heap', icon: List },
    { id: 'hash', label: 'Hash Table', icon: Hash },
    { id: 'graph', label: 'Graph', icon: Share2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'stack': return <StackViz />;
      case 'queue': return <QueueViz />;
      case 'linkedlist': return <LinkedListViz />;
      case 'bst': return <BSTViz />;
      case 'heap': return <HeapViz />;
      case 'hash': return <HashViz />;
      case 'graph': return <GraphViz />;
      default: return <StackViz />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
            <Database className="text-blue-500" />
            StructViz
          </h1>
          <p className="text-xs text-slate-500 mt-2">Interactive Data Structures</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <tab.icon size={20} />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-600 text-center">
           Version 2.0 • Animated
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {renderContent()}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0); }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
         @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default App;