'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { AI_CONFIGS, MODEL_OPTIONS } from '@/lib/ai-config';
import { AIModel } from '@/lib/types';
import { useMindMapStore } from '@/lib/store';
import { Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { findNodeById } from '@/lib/utils';

interface AIExpandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpand: (nodeId: string, count: number, model: AIModel, customModel?: string) => Promise<void>;
}

export const AIExpandModal = ({
  isOpen,
  onClose,
  onExpand,
}: AIExpandModalProps) => {
  const [count, setCount] = useState(4);
  const [selectedProvider, setSelectedProvider] = useState<AIModel>('deepseek');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isExpanding, setIsExpanding] = useState(false);
  const { currentMindMap, selectedNodeId } = useMindMapStore();

  const modelOptions = MODEL_OPTIONS[selectedProvider] || [];
  const selectedNode = selectedNodeId && currentMindMap
    ? findNodeById(currentMindMap.nodes, selectedNodeId)
    : null;

  const handleExpand = async () => {
    if (!selectedNodeId) return;

    setIsExpanding(true);
    try {
      await onExpand(selectedNodeId, count, selectedProvider, selectedModel || undefined);
      onClose();
    } catch (err) {
      console.error('扩展失败', err);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 扩展节点" size="lg">
      <div className="space-y-6">
        {selectedNode && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-xs font-medium text-blue-600 mb-1">选中的节点</div>
            <div className="text-gray-900 font-medium">{selectedNode.text}</div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            子节点数量
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="2"
              max="8"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl font-bold text-blue-600">
              {count}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择AI提供商
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(AI_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedProvider(key as AIModel);
                  setSelectedModel('');
                }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedProvider === key
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-xs truncate">
                      {config.name}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {modelOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择具体模型
            </label>
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">使用默认模型</option>
                {modelOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} - {option.description}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isExpanding}>
            取消
          </Button>
          <Button
            onClick={handleExpand}
            loading={isExpanding}
            disabled={!selectedNodeId}
          >
            {isExpanding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                扩展中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                开始扩展
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
