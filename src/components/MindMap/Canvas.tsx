'use client';

import { useCallback, useEffect, useMemo } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMindMapStore } from '@/lib/store';
import { MindMapNode } from './Node';
import { MindNode } from '@/lib/types';
import { THEME_COLORS } from '@/lib/ai-config';

const nodeTypes = {
  mindMapNode: MindMapNode,
};

export const Canvas = () => {
  const {
    currentMindMap,
    selectedNodeId,
    setSelectedNode,
    updateNode,
    addNode,
  } = useMindMapStore();

  const theme = currentMindMap?.settings.theme || 'default';
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.default;

  const convertToFlowNodes = useCallback(
    (
      nodes: MindNode[],
      x: number,
      y: number,
      level: number
    ): { nodes: Node[]; edges: Edge[] } => {
      const flowNodes: Node[] = [];
      const edges: Edge[] = [];
      const horizontalGap = level === 0 ? 300 : 200;
      const verticalGap = 80;
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

          const edge: Edge = {
            id: `e-${node.id}-${node.children[0].id}`,
            source: node.id,
            target: node.children[0].id,
            type: 'smoothstep',
            style: {
              stroke: colors.secondary,
              strokeWidth: 2,
            },
            animated: false,
          };
          edges.push(edge);

          for (let i = 1; i < node.children.length; i++) {
            edges.push({
              id: `e-${node.id}-${node.children[i].id}`,
              source: node.id,
              target: node.children[i].id,
              type: 'smoothstep',
              style: {
                stroke: colors.secondary,
                strokeWidth: 2,
              },
            });
          }
        }
      });

      return { nodes: flowNodes, edges };
    },
    [selectedNodeId, theme, colors]
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
      const newText = prompt('输入新的节点内容:', node.data.node.text);
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
    },
    [selectedNodeId, addNode]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentMindMap) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">暂无思维导图</p>
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
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls
          className="!bg-white !shadow-lg !rounded-lg !border !border-gray-200"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-white !shadow-lg !rounded-lg !border !border-gray-200"
          nodeColor={colors.primary}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};
