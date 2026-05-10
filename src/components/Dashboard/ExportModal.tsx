'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { XMindParser } from '@/lib/xmind-parser';
import { useMindMapStore } from '@/lib/store';
import { Download, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const [exportType, setExportType] = useState<'xmind' | 'json'>('xmind');
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { currentMindMap } = useMindMapStore();

  const handleExport = async () => {
    if (!currentMindMap) return;

    setIsExporting(true);
    setSuccess(false);

    try {
      let blob: Blob;
      let filename: string;

      if (exportType === 'xmind') {
        blob = await XMindParser.export(currentMindMap);
        filename = `${currentMindMap.title || 'mindmap'}.xmind`;
      } else {
        const jsonStr = JSON.stringify(currentMindMap, null, 2);
        blob = new Blob([jsonStr], { type: 'application/json' });
        filename = `${currentMindMap.title || 'mindmap'}.json`;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsExporting(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Export failed:', err);
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="导出思维导图" size="md">
      <div className="space-y-6">
        <div className="text-sm text-gray-600">
          <p>选择导出格式，保存你的思维导图</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setExportType('xmind')}
            className={`p-6 rounded-xl border-2 transition-all ${
              exportType === 'xmind'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">XMind格式</div>
                <div className="text-xs text-gray-500">.xmind</div>
              </div>
              {exportType === 'xmind' && (
                <CheckCircle className="w-6 h-6 text-blue-600" />
              )}
            </div>
          </button>

          <button
            onClick={() => setExportType('json')}
            className={`p-6 rounded-xl border-2 transition-all ${
              exportType === 'json'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">JSON格式</div>
                <div className="text-xs text-gray-500">.json</div>
              </div>
              {exportType === 'json' && (
                <CheckCircle className="w-6 h-6 text-blue-600" />
              )}
            </div>
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm">
            {exportType === 'xmind' ? (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">XMind格式导出</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• 生成标准的.xmind文件</li>
                  <li>• 可用XMind软件打开</li>
                  <li>• 保留思维导图结构</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">JSON格式导出</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• 导出为JSON数据文件</li>
                  <li>• 可用于数据备份</li>
                  <li>• 支持其他程序读取</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {isExporting && !success && (
          <div className="flex items-center justify-center gap-3 p-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-600">正在导出...</span>
          </div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">导出成功！</span>
          </motion.div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleExport} loading={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            导出{exportType === 'xmind' ? 'XMind' : 'JSON'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
