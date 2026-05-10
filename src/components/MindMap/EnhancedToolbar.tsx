'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMindMapStore } from '@/lib/store';
import { Button } from '@/components/UI/Button';
import { ExportModal } from '@/components/Dashboard/ExportModal';
import { AIGenerateModal } from '@/components/AI/AIGenerateModal';
import { AIExpandModal } from '@/components/AI/AIExpandModal';
import { countNodes } from '@/lib/utils';
import { THEME_COLORS } from '@/lib/ai-config';
import { ThemeColor } from '@/lib/types';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Expand,
  Download,
  Undo2,
  Redo2,
  LayoutGrid,
  Palette,
  Keyboard,
  Trash2,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  ChevronDown,
  X,
} from 'lucide-react';

interface ToolbarProps {
  onSave?: () => void;
}

export const EnhancedToolbar = ({ onSave }: ToolbarProps) => {
  const router = useRouter();
  const {
    currentMindMap,
    updateMindMap,
    selectedNodeId,
    addNode,
    deleteNode,
    updateNodes,
    updateSettings,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
  } = useMindMapStore();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentMindMap?.title || '');
  const [showShortcuts, setShowShortcuts] = useState(false);

  const theme = currentMindMap?.settings.theme || 'default';
  const layout = currentMindMap?.settings.layout || 'horizontal';
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.default;

  const nodeCount = currentMindMap ? countNodes(currentMindMap.nodes) : 0;

  const handleTitleSave = () => {
    if (currentMindMap && titleValue.trim()) {
      updateMindMap(currentMindMap.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAIGenerate = async (topic: string, model: any, customModel?: string) => {
    saveToHistory();
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, model, customModel }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '生成失败');
    }

    const data = await response.json();
    if (data.nodes && currentMindMap) {
      const newNodes: any[] = [{
        id: currentMindMap.id + '-root',
        text: topic,
        children: data.nodes,
        expanded: true,
      }];
      updateNodes(newNodes);
      updateMindMap(currentMindMap.id, { title: topic });
    }
  };

  const handleAIExpand = async (nodeId: string, count: number, model: any, customModel?: string) => {
    saveToHistory();
    const findNode = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children?.length) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const node = currentMindMap?.nodes ? findNode(currentMindMap.nodes) : null;
    if (!node) return;

    const response = await fetch('/api/ai/expand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeText: node.text, count, model, customModel }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '扩展失败');
    }

    const data = await response.json();
    if (data.children) {
      const addChildrenToNode = (nodes: any[], targetId: string, children: any[]): any[] => {
        return nodes.map((n) => {
          if (n.id === targetId) {
            return { ...n, children: [...n.children, ...children] };
          }
          if (n.children?.length) {
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

  const handleThemeChange = (newTheme: ThemeColor) => {
    updateSettings({ theme: newTheme });
    setIsThemeMenuOpen(false);
  };

  const handleLayoutChange = (newLayout: 'horizontal' | 'vertical' | 'tree') => {
    updateSettings({ layout: newLayout });
    setIsLayoutMenuOpen(false);
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      onSave?.();
    }
  }, [undo, redo, onSave]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const themeOptions = Object.entries(THEME_COLORS).map(([key, value]) => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    color: value.primary,
  }));

  const layoutOptions = [
    { key: 'horizontal', name: '水平布局', icon: LayoutGrid },
    { key: 'vertical', name: '垂直布局', icon: Grid3X3 },
    { key: 'tree', name: '树形布局', icon: LayoutGrid },
  ] as const;

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

          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="撤销 (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="重做 (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleAddNode}>
            <Plus className="w-4 h-4 mr-1" />
            添加
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

          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              title="主题"
            >
              <Palette className="w-4 h-4 text-gray-600" />
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isThemeMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  {themeOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleThemeChange(option.key as ThemeColor)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="text-sm text-gray-700">{option.name}</span>
                      {theme === option.key && (
                        <X className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              title="布局"
            >
              <LayoutGrid className="w-4 h-4 text-gray-600" />
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isLayoutMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLayoutMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  {layoutOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleLayoutChange(option.key)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <option.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{option.name}</span>
                      {layout === option.key && (
                        <X className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setShowShortcuts(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="快捷键"
          >
            <Keyboard className="w-4 h-4 text-gray-600" />
          </button>

          <Button variant="ghost" size="sm" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4 mr-1" />
            导出
          </Button>

          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-1" />
            保存
          </Button>

          <div className="ml-4 text-sm text-gray-500">
            {nodeCount} 节点
          </div>
        </div>
      </div>

      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">键盘快捷键</h2>
              <button onClick={() => setShowShortcuts(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">通用</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>保存</span><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl + S</kbd></div>
                    <div className="flex justify-between"><span>撤销</span><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl + Z</kbd></div>
                    <div className="flex justify-between"><span>重做</span><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl + Shift + Z</kbd></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">节点操作</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>添加同级节点</span><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Enter</kbd></div>
                    <div className="flex justify-between"><span>添加子节点</span><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Tab</kbd></div>
                    <div className="flex justify-between"><span>删除节点</span><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Delete</kbd></div>
                    <div className="flex justify-between"><span>编辑节点</span><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">双击</kbd></div>
                    <div className="flex justify-between"><span>取消选择</span><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Escape</kbd></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </>
  );
};
