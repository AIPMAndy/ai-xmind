'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useMindMapStore } from '@/lib/store';
import { AI_CONFIGS } from '@/lib/ai-config';
import { AIModel } from '@/lib/types';
import { Sparkles, Loader2 } from 'lucide-react';
import { findNodeById } from '@/lib/utils';

interface AIExpandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpand: (nodeId: string, count: number, model: AIModel) => Promise<void>;
}

export const AIExpandModal = ({
  isOpen,
  onClose,
  onExpand,
}: AIExpandModalProps) => {
  const [count, setCount] = useState(4);
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai');
  const [isExpanding, setIsExpanding] = useState(false);
  const { currentMindMap, selectedNodeId } = useMindMapStore();

  const selectedNode = selectedNodeId && currentMindMap
    ? findNodeById(currentMindMap.nodes, selectedNodeId)
    : null;

  const handleExpand = async () => {
    if (!selectedNodeId) return;

    setIsExpanding(true);
    try {
      await onExpand(selectedNodeId, count, selectedModel);
      onClose();
    } catch (err) {
      console.error('扩展失败', err);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 扩展节点" size="md">
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
            选择AI模型
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(AI_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedModel(key as AIModel)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedModel === key
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {config.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

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
