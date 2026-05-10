'use client';

import { useState, useRef } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { XMindParser } from '@/lib/xmind-parser';
import { useMindMapStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal = ({ isOpen, onClose }: ImportModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMindMap, loadMindMap } = useMindMapStore();
  const router = useRouter();

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xmind')) {
      setError('请选择.xmind格式的文件');
      return;
    }

    setIsImporting(true);
    setError('');
    setSuccess(false);

    try {
      const mindMap = await XMindParser.parse(file);
      const newMindMap = addMindMap(mindMap.title, mindMap.nodes);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        loadMindMap(newMindMap);
        router.push(`/editor/${newMindMap.id}`);
        setSuccess(false);
        setIsImporting(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || '导入失败');
      setIsImporting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="导入XMind文件" size="md">
      <div className="space-y-6">
        <div className="text-sm text-gray-600">
          <p>支持导入.xmind格式文件，轻松迁移你的思维导图数据</p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${isImporting ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          `}
          onClick={() => !isImporting && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xmind"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            {isImporting && !success ? (
              <>
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <p className="text-lg font-medium text-gray-700">正在导入...</p>
              </>
            ) : success ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <p className="text-lg font-medium text-green-700">导入成功！</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    拖拽文件到此处，或点击选择文件
                  </p>
                  <p className="text-sm text-gray-500">
                    支持 .xmind 格式文件
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">导入提示</p>
              <ul className="text-blue-700 space-y-1">
                <li>• 支持XMind 8/9/10格式</li>
                <li>• 保留思维导图的基本结构</li>
                <li>• 导入后可在编辑器中进一步编辑</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
        </div>
      </div>
    </Modal>
  );
};
