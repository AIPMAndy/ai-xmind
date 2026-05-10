'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useMindMapStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, FileText } from 'lucide-react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateModal = ({ isOpen, onClose }: CreateModalProps) => {
  const [title, setTitle] = useState('');
  const [createType, setCreateType] = useState<'blank' | 'ai'>('blank');
  const { addMindMap } = useMindMapStore();
  const router = useRouter();

  const handleCreate = () => {
    if (!title.trim()) return;

    const newMindMap = addMindMap(title.trim());
    onClose();
    setTitle('');
    router.push(`/editor/${newMindMap.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="创建思维导图" size="md">
      <div className="space-y-6">
        <Input
          label="标题"
          placeholder="给你的思维导图起个名字"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            创建方式
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCreateType('blank')}
              className={`p-6 rounded-xl border-2 transition-all ${
                createType === 'blank'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <div className="font-medium text-gray-900 mb-1">空白画布</div>
              <div className="text-xs text-gray-500">从零开始手动创建</div>
            </button>

            <button
              onClick={() => setCreateType('ai')}
              className={`p-6 rounded-xl border-2 transition-all ${
                createType === 'ai'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <div className="font-medium text-gray-900 mb-1">AI 创建</div>
              <div className="text-xs text-gray-500">AI 智能生成结构</div>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            创建
          </Button>
        </div>
      </div>
    </Modal>
  );
};
