import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MindMap, MindNode, MindMapSettings, AIModel } from './types';
import { v4 as uuidv4 } from 'uuid';

interface HistoryState {
  nodes: MindNode[];
  timestamp: number;
}

interface MindMapState {
  mindMaps: MindMap[];
  currentMindMap: MindMap | null;
  selectedNodeId: string | null;
  isAIGenerating: boolean;
  aiModel: AIModel;
  theme: string;
  history: HistoryState[];
  historyIndex: number;
  maxHistorySize: number;
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
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
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
      history: [],
      historyIndex: -1,
      maxHistorySize: 50,

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
          set({ currentMindMap: null, selectedNodeId: null, history: [], historyIndex: -1 });
          return;
        }
        const mindMap = get().mindMaps.find((m) => m.id === id);
        set({ 
          currentMindMap: mindMap || null, 
          selectedNodeId: null,
          history: mindMap ? [{ nodes: JSON.parse(JSON.stringify(mindMap.nodes)), timestamp: Date.now() }] : [],
          historyIndex: mindMap ? 0 : -1
        });
      },

      saveToHistory: () => {
        const currentMap = get().currentMindMap;
        if (!currentMap) return;

        const { history, historyIndex, maxHistorySize } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          nodes: JSON.parse(JSON.stringify(currentMap.nodes)),
          timestamp: Date.now(),
        });

        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex, currentMindMap } = get();
        if (historyIndex > 0 && currentMindMap) {
          const previousState = history[historyIndex - 1];
          get().updateNodes(previousState.nodes);
          set({ historyIndex: historyIndex - 1 });
        }
      },

      redo: () => {
        const { history, historyIndex, currentMindMap } = get();
        if (historyIndex < history.length - 1 && currentMindMap) {
          const nextState = history[historyIndex + 1];
          get().updateNodes(nextState.nodes);
          set({ historyIndex: historyIndex + 1 });
        }
      },

      canUndo: () => {
        const { historyIndex } = get();
        return historyIndex > 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      addNode: (parentId: string, text: string) => {
        get().saveToHistory();
        
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
        get().saveToHistory();
        
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
        get().saveToHistory();
        
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
        set({ 
          currentMindMap: mindMap, 
          selectedNodeId: null,
          history: [{ nodes: JSON.parse(JSON.stringify(mindMap.nodes)), timestamp: Date.now() }],
          historyIndex: 0
        });
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
