'use client';

import { useRouter } from 'next/navigation';
import { MindMap } from '@/lib/types';
import { useMindMapStore } from '@/lib/store';
import { formatDate, countNodes } from '@/lib/utils';
import { THEME_COLORS } from '@/lib/ai-config';
import { Trash2, ExternalLink, Clock, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

interface MindMapCardProps {
  mindMap: MindMap;
  index: number;
}

export const MindMapCard = ({ mindMap, index }: MindMapCardProps) => {
  const router = useRouter();
  const { deleteMindMap, loadMindMap } = useMindMapStore();
  const theme = mindMap.settings.theme || 'default';
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.default;
  const nodeCount = countNodes(mindMap.nodes);

  const handleOpen = () => {
    loadMindMap(mindMap);
    router.push(`/editor/${mindMap.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个思维导图吗？')) {
      deleteMindMap(mindMap.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={handleOpen}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer"
    >
      <div
        className="h-32 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary}20 100%)`,
        }}
      >
        <div className="flex flex-col items-center gap-2 opacity-60">
          <GitBranch className="w-12 h-12" style={{ color: colors.primary }} />
          <div className="text-sm font-medium" style={{ color: colors.text }}>
            {mindMap.nodes[0]?.text || '空思维导图'}
          </div>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            className="p-2 bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg shadow-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">
          {mindMap.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(mindMap.updatedAt)}
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="w-4 h-4" />
            {nodeCount} 节点
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: colors.background,
              color: colors.text,
            }}
          >
            {theme}
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};
