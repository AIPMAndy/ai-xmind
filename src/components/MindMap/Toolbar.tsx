'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMindMapStore } from '@/lib/store';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { AIGenerateModal } from '@/components/AI/AIGenerateModal';
import { AIExpandModal } from '@/components/AI/AIExpandModal';
import { countNodes } from '@/lib/utils';
import { THEME_COLORS } from '@/lib/ai-config';
import { AIModel, MindNode } from '@/lib/types';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Expand,
  Download,
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Trash2,
  Plus,
} from 'lucide-react';

interface ToolbarProps {
  onSave?: () => void;
}

export const Toolbar = ({ onSave }: ToolbarProps) => {
  const router = useRouter();
  const {
    currentMindMap,
    updateMindMap,
    selectedNodeId,
    addNode,
    deleteNode,
    updateNodes,
    updateSettings,
  } = useMindMapStore();

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentMindMap?.title || '');

  const theme = currentMindMap?.settings.theme || 'default';
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.default;

  const nodeCount = currentMindMap ? countNodes(currentMindMap.nodes) : 0;

  const handleTitleSave = () => {
    if (currentMindMap && titleValue.trim()) {
      updateMindMap(currentMindMap.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAIGenerate = async (topic: string, model: AIModel) => {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, model }),
    });

    if (!response.ok) {
      throw new Error('生成失败');
    }

    const data = await response.json();
    if (data.nodes && currentMindMap) {
      const newNodes: MindNode[] = [
        {
          id: currentMindMap.id + '-root',
          text: topic,
          children: data.nodes,
          expanded: true,
        },
      ];
      updateNodes(newNodes);
      updateMindMap(currentMindMap.id, { title: topic });
    }
  };

  const handleAIExpand = async (nodeId: string, count: number, model: AIModel) => {
    const node = currentMindMap?.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const response = await fetch('/api/ai/expand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeText: node.text, count, model }),
    });

    if (!response.ok) {
      throw new Error('扩展失败');
    }

    const data = await response.json();
    if (data.children) {
      const addChildrenToNode = (nodes: MindNode[], targetId: string, children: MindNode[]): MindNode[] => {
        return nodes.map((n) => {
          if (n.id === targetId) {
            return { ...n, children: [...n.children, ...children] };
          }
          if (n.children.length > 0) {
            return { ...n, children: addChildrenToNode(n.children, targetId, children) };
          }
          return n;
        });
      };

      if (currentMindMap) {
        const newNodes = addChildrenToNode(currentMindMap.nodes, nodeId, data.children);
        updateNodes(newNodes);
      }
    }
  };

  const handleExport = () => {
    if (!currentMindMap) return;

    const dataStr = JSON.stringify(currentMindMap, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentMindMap.title || 'mindmap'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddNode = () => {
    if (selectedNodeId) {
      addNode(selectedNodeId, '新节点');
    } else if (currentMindMap?.nodes[0]) {
      addNode(currentMindMap.nodes[0].id, '新节点');
    }
  };

  const handleDeleteNode = () => {
    if (selectedNodeId && currentMindMap?.nodes[0]?.id !== selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  };

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          {isEditingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="text-lg font-semibold border-b-2 border-blue-500 outline-none bg-transparent"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => {
                setTitleValue(currentMindMap?.title || '');
                setIsEditingTitle(true);
              }}
            >
              {currentMindMap?.title || '未命名'}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleAddNode}>
            <Plus className="w-4 h-4 mr-1" />
            添加节点
          </Button>

          {selectedNodeId && currentMindMap?.nodes[0]?.id !== selectedNodeId && (
            <Button variant="ghost" size="sm" onClick={handleDeleteNode}>
              <Trash2 className="w-4 h-4 mr-1" />
              删除
            </Button>
          )}

          <div className="w-px h-8 bg-gray-200 mx-2" />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpandModalOpen(true)}
            disabled={!selectedNodeId && !currentMindMap?.nodes[0]}
          >
            <Expand className="w-4 h-4 mr-1" />
            AI扩展
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsGenerateModalOpen(true)}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            AI创建
          </Button>

          <div className="w-px h-8 bg-gray-200 mx-2" />

          <Button variant="ghost" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            导出
          </Button>

          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-1" />
            保存
          </Button>

          <div className="ml-4 text-sm text-gray-500">
            {nodeCount} 个节点
          </div>
        </div>
      </div>

      <AIGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleAIGenerate}
      />

      <AIExpandModal
        isOpen={isExpandModalOpen}
        onClose={() => setIsExpandModalOpen(false)}
        onExpand={handleAIExpand}
      />
    </>
  );
};
