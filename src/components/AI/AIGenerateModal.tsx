'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useMindMapStore } from '@/lib/store';
import { AI_CONFIGS, PROMPTS } from '@/lib/ai-config';
import { AIModel, MindNode } from '@/lib/types';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string, model: AIModel) => Promise<void>;
}

export const AIGenerateModal = ({
  isOpen,
  onClose,
  onGenerate,
}: AIGenerateModalProps) => {
  const [topic, setTopic] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请输入主题');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      await onGenerate(topic.trim(), selectedModel);
      onClose();
      setTopic('');
    } catch (err) {
      setError('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 创建思维导图" size="md">
      <div className="space-y-6">
        <div className="text-gray-600 text-sm leading-relaxed">
          <p>输入你想要探索的主题，AI将为你生成一个完整的思维导图结构。</p>
        </div>

        <Input
          label="主题"
          placeholder="例如：人工智能在教育中的应用"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          error={error}
          autoFocus
        />

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
          <Button variant="secondary" onClick={onClose} disabled={isGenerating}>
            取消
          </Button>
          <Button
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!topic.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                开始生成
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
