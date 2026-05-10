'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
  NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMindMapStore } from '@/lib/store';
import { MindMapNode } from './Node';
import { MindNode, MindMapSettings } from '@/lib/types';
import { THEME_COLORS } from '@/lib/ai-config';

interface CustomNodeData {
  node: MindNode;
  theme: string;
}

const nodeTypes = {
  mindMapNode: MindMapNode,
};

interface LayoutConfig {
  type: 'horizontal' | 'vertical' | 'radial' | 'tree';
  horizontalGap: number;
  verticalGap: number;
}

const LAYOUT_CONFIGS: Record<string, LayoutConfig> = {
  horizontal: {
    type: 'horizontal',
    horizontalGap: 280,
    verticalGap: 80,
  },
  vertical: {
    type: 'vertical',
    horizontalGap: 280,
    verticalGap: 80,
  },
  tree: {
    type: 'horizontal',
    horizontalGap: 200,
    verticalGap: 60,
  },
};

export const EnhancedCanvas = () => {
  const {
    currentMindMap,
    selectedNodeId,
    setSelectedNode,
    updateNode,
    addNode,
  } = useMindMapStore();

  const theme = currentMindMap?.settings.theme || 'default';
  const layout = currentMindMap?.settings.layout || 'horizontal';
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.default;
  const layoutConfig = LAYOUT_CONFIGS[layout] || LAYOUT_CONFIGS.horizontal;

  const convertToFlowNodes = useCallback(
    (
      nodes: MindNode[],
      x: number,
      y: number,
      level: number
    ): { nodes: Node[]; edges: Edge[] } => {
      const flowNodes: Node[] = [];
      const edges: Edge[] = [];
      
      const horizontalGap = layoutConfig.horizontalGap - (level * 20);
      const verticalGap = layoutConfig.verticalGap;
      const totalHeight = nodes.length * verticalGap;
      const startYOffset = y - totalHeight / 2 + verticalGap / 2;

      nodes.forEach((node, index) => {
        const nodeY = startYOffset + index * verticalGap;
        const flowNode: Node = {
          id: node.id,
          type: 'mindMapNode',
          position: { x, y: nodeY },
          data: { node, theme },
          selected: node.id === selectedNodeId,
        };
        flowNodes.push(flowNode);

        if (node.children.length > 0) {
          const childX = x + horizontalGap;
          const { nodes: childNodes, edges: childEdges } = convertToFlowNodes(
            node.children,
            childX,
            nodeY,
            level + 1
          );
          flowNodes.push(...childNodes);
          edges.push(...childEdges);

          for (let i = 0; i < node.children.length; i++) {
            edges.push({
              id: `e-${node.id}-${node.children[i].id}`,
              source: node.id,
              target: node.children[i].id,
              type: 'smoothstep',
              style: {
                stroke: colors.secondary,
                strokeWidth: 2 - (level * 0.2),
              },
            });
          }
        }
      });

      return { nodes: flowNodes, edges };
    },
    [selectedNodeId, theme, colors, layoutConfig]
  );

  const initialData = useMemo(() => {
    if (!currentMindMap?.nodes || currentMindMap.nodes.length === 0) {
      return { nodes: [], edges: [] };
    }
    return convertToFlowNodes(currentMindMap.nodes, 100, 300, 0);
  }, [currentMindMap?.nodes, convertToFlowNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  useEffect(() => {
    const newData = convertToFlowNodes(
      currentMindMap?.nodes || [],
      100,
      300,
      0
    );
    setNodes(newData.nodes);
    setEdges(newData.edges);
  }, [currentMindMap?.nodes, convertToFlowNodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent, node: Node) => {
      e.stopPropagation();
      const nodeData = node.data as unknown as CustomNodeData;
      const newText = prompt('输入新的节点内容:', nodeData?.node?.text);
      if (newText && newText.trim()) {
        updateNode(node.id, newText.trim());
      }
    },
    [updateNode]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedNodeId) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const newText = prompt('输入新节点内容:');
        if (newText && newText.trim()) {
          addNode(selectedNodeId, newText.trim());
        }
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const newText = prompt('输入子节点内容:');
        if (newText && newText.trim()) {
          addNode(selectedNodeId, newText.trim());
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            const currentMap = useMindMapStore.getState().currentMindMap;
            if (currentMap?.nodes[0]?.id !== selectedNodeId) {
              useMindMapStore.getState().deleteNode(selectedNodeId);
            }
          }
        }
      }

      if (e.key === 'Escape') {
        setSelectedNode(null);
      }
    },
    [selectedNodeId, addNode, setSelectedNode]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentMindMap) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">暂无思维导图</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={handleDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
      >
        <Background 
          color={layout === 'horizontal' ? '#e5e7eb' : '#d1d5db'} 
          gap={layout === 'horizontal' ? 20 : 25} 
        />
        <Controls
          className="!bg-white !shadow-lg !rounded-lg !border !border-gray-200"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-white !shadow-lg !rounded-lg !border !border-gray-200"
          nodeColor={colors.primary}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </div>
  );
};
