'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useMindMapStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/lib/xmind-parser';
import { FileText, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { MindNode } from '@/lib/types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createNodesFromTemplate = (templateNodes: any[]): MindNode[] => {
  const convert = (nodes: any[]): MindNode[] => {
    return nodes.map(node => ({
      id: uuidv4(),
      text: node.text,
      children: node.children ? convert(node.children) : [],
      expanded: true,
    }));
  };
  return convert(templateNodes);
};

export const TemplateModal = ({ isOpen, onClose }: TemplateModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [createType, setCreateType] = useState<'blank' | 'template'>('template');
  const { addMindMap } = useMindMapStore();
  const router = useRouter();

  const handleCreate = () => {
    if (!title.trim()) return;

    let nodes: MindNode[] = [];

    if (createType === 'template' && selectedTemplate) {
      const template = TEMPLATES[selectedTemplate as keyof typeof TEMPLATES];
      if (template.nodes.length > 0) {
        nodes = createNodesFromTemplate(template.nodes);
      }
    }

    const newMindMap = addMindMap(title.trim(), nodes);
    onClose();
    setTitle('');
    setSelectedTemplate(null);
    setCreateType('template');
    router.push(`/editor/${newMindMap.id}`);
  };

  const templateEntries = Object.entries(TEMPLATES);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="选择模板" size="lg">
      <div className="space-y-6">
        <Input
          label="思维导图标题"
          placeholder="给你的思维导图起个名字"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择模板
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
            <button
              onClick={() => setSelectedTemplate('blank')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedTemplate === 'blank'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">空白画布</div>
              </div>
            </button>

            {templateEntries.map(([key, template]) => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedTemplate === key
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    {selectedTemplate === key && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedTemplate && selectedTemplate !== 'blank' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">模板预览</p>
                <p className="text-blue-700">
                  将创建一个包含预设结构的思维导图，你可以继续添加和修改内容
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim()}
          >
            创建思维导图
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
