'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { AI_CONFIGS, MODEL_OPTIONS } from '@/lib/ai-config';
import { AIModel } from '@/lib/types';
import { Sparkles, Loader2, ChevronDown, Check } from 'lucide-react';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string, model: AIModel, customModel?: string) => Promise<void>;
}

export const AIGenerateModal = ({
  isOpen,
  onClose,
  onGenerate,
}: AIGenerateModalProps) => {
  const [topic, setTopic] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<AIModel>('deepseek');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const modelOptions = MODEL_OPTIONS[selectedProvider] || [];
  const providerInfo = AI_CONFIGS[selectedProvider];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请输入主题');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      await onGenerate(topic.trim(), selectedProvider, selectedModel || undefined);
      onClose();
      setTopic('');
      setSelectedModel('');
    } catch (err) {
      setError('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 创建思维导图" size="lg">
      <div className="space-y-6">
        <div className="text-gray-600 text-sm leading-relaxed">
          <p>输入你想要探索的主题，AI将为你生成一个完整的思维导图结构。支持多种国产和国际大模型。</p>
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
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-500 leading-tight mt-1">
                      {config.provider}
                    </div>
                  </div>
                  {selectedProvider === key && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
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

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{providerInfo?.icon}</div>
            <div>
              <div className="font-medium text-amber-900 mb-1">
                {providerInfo?.name}
              </div>
              <p className="text-sm text-amber-700">
                {providerInfo?.description}
              </p>
              <p className="text-xs text-amber-600 mt-2">
                请确保已在环境变量中配置相应的 API Key
              </p>
            </div>
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
