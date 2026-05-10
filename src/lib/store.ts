import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MindMap, MindNode, MindMapSettings, AIModel } from './types';
import { v4 as uuidv4 } from 'uuid';

interface MindMapState {
  mindMaps: MindMap[];
  currentMindMap: MindMap | null;
  selectedNodeId: string | null;
  isAIGenerating: boolean;
  aiModel: AIModel;
  theme: string;
  addMindMap: (title: string, nodes?: MindNode[]) => MindMap;
  updateMindMap: (id: string, updates: Partial<MindMap>) => void;
  deleteMindMap: (id: string) => void;
  setCurrentMindMap: (id: string | null) => void;
  addNode: (parentId: string, text: string) => void;
  updateNode: (nodeId: string, text: string) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setAIGenerating: (isGenerating: boolean) => void;
  setAIModel: (model: AIModel) => void;
  updateSettings: (settings: Partial<MindMapSettings>) => void;
  loadMindMap: (mindMap: MindMap) => void;
  updateNodes: (nodes: MindNode[]) => void;
}

const createDefaultNode = (text: string = '中心主题'): MindNode => ({
  id: uuidv4(),
  text,
  children: [],
  expanded: true,
});

export const useMindMapStore = create<MindMapState>()(
  persist(
    (set, get) => ({
      mindMaps: [],
      currentMindMap: null,
      selectedNodeId: null,
      isAIGenerating: false,
      aiModel: 'openai',
      theme: 'default',

      addMindMap: (title: string, nodes?: MindNode[]) => {
        const newMindMap: MindMap = {
          id: uuidv4(),
          title,
          nodes: nodes || [createDefaultNode(title || '中心主题')],
          settings: {
            layout: 'horizontal',
            theme: 'default',
            zoom: 1,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          mindMaps: [...state.mindMaps, newMindMap],
        }));
        return newMindMap;
      },

      updateMindMap: (id: string, updates: Partial<MindMap>) => {
        set((state) => ({
          mindMaps: state.mindMaps.map((m) =>
            m.id === id
              ? { ...m, ...updates, updatedAt: new Date().toISOString() }
              : m
          ),
          currentMindMap:
            state.currentMindMap?.id === id
              ? {
                  ...state.currentMindMap,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.currentMindMap,
        }));
      },

      deleteMindMap: (id: string) => {
        set((state) => ({
          mindMaps: state.mindMaps.filter((m) => m.id !== id),
          currentMindMap:
            state.currentMindMap?.id === id ? null : state.currentMindMap,
        }));
      },

      setCurrentMindMap: (id: string | null) => {
        if (id === null) {
          set({ currentMindMap: null, selectedNodeId: null });
          return;
        }
        const mindMap = get().mindMaps.find((m) => m.id === id);
        set({ currentMindMap: mindMap || null, selectedNodeId: null });
      },

      addNode: (parentId: string, text: string) => {
        const addNodeToTree = (
          nodes: MindNode[],
          targetId: string
        ): MindNode[] => {
          return nodes.map((node) => {
            if (node.id === targetId) {
              const newNode: MindNode = {
                id: uuidv4(),
                text,
                children: [],
                expanded: true,
              };
              return {
                ...node,
                children: [...node.children, newNode],
              };
            }
            if (node.children.length > 0) {
              return {
                ...node,
                children: addNodeToTree(node.children, targetId),
              };
            }
            return node;
          });
        };

        const currentMap = get().currentMindMap;
        if (!currentMap) return;

        const updatedNodes = addNodeToTree(currentMap.nodes, parentId);
        get().updateNodes(updatedNodes);
      },

      updateNode: (nodeId: string, text: string) => {
        const updateNodeInTree = (nodes: MindNode[]): MindNode[] => {
          return nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, text };
            }
            if (node.children.length > 0) {
              return {
                ...node,
                children: updateNodeInTree(node.children),
              };
            }
            return node;
          });
        };

        const currentMap = get().currentMindMap;
        if (!currentMap) return;

        const updatedNodes = updateNodeInTree(currentMap.nodes);
        get().updateNodes(updatedNodes);
      },

      deleteNode: (nodeId: string) => {
        const deleteNodeFromTree = (nodes: MindNode[]): MindNode[] => {
          return nodes
            .filter((node) => node.id !== nodeId)
            .map((node) => ({
              ...node,
              children: deleteNodeFromTree(node.children),
            }));
        };

        const currentMap = get().currentMindMap;
        if (!currentMap) return;

        const updatedNodes = deleteNodeFromTree(currentMap.nodes);
        get().updateNodes(updatedNodes);
        set({ selectedNodeId: null });
      },

      setSelectedNode: (nodeId: string | null) => {
        set({ selectedNodeId: nodeId });
      },

      setAIGenerating: (isGenerating: boolean) => {
        set({ isAIGenerating: isGenerating });
      },

      setAIModel: (model: AIModel) => {
        set({ aiModel: model });
      },

      updateSettings: (settings: Partial<MindMapSettings>) => {
        const currentMap = get().currentMindMap;
        if (!currentMap) return;

        get().updateMindMap(currentMap.id, {
          settings: { ...currentMap.settings, ...settings },
        });
      },

      loadMindMap: (mindMap: MindMap) => {
        set({ currentMindMap: mindMap, selectedNodeId: null });
      },

      updateNodes: (nodes: MindNode[]) => {
        const currentMap = get().currentMindMap;
        if (!currentMap) return;

        get().updateMindMap(currentMap.id, { nodes });
      },
    }),
    {
      name: 'ai-xmind-storage',
      partialize: (state) => ({
        mindMaps: state.mindMaps,
        aiModel: state.aiModel,
        theme: state.theme,
      }),
    }
  )
);
