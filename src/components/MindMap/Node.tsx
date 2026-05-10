'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MindNode as MindNodeType } from '@/lib/types';
import { useMindMapStore } from '@/lib/store';
import { getThemeColor } from '@/lib/utils';
import { THEME_COLORS } from '@/lib/ai-config';

interface CustomNodeData {
  node: MindNodeType;
  theme?: string;
}

export const MindMapNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const { setSelectedNode, currentMindMap } = useMindMapStore();
  const theme = nodeData.theme || currentMindMap?.settings.theme || 'default';
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.default;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(nodeData.node.id);
  };

  return (
    <div
      className={`relative group ${selected ? 'z-10' : ''}`}
      onClick={handleClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-300 !w-2 !h-2 !border-0"
      />
      
      <div
        className={`
          px-4 py-2.5 rounded-xl shadow-md transition-all duration-200
          min-w-[100px] max-w-[280px] text-center
          ${selected 
            ? 'shadow-xl ring-2 ring-blue-500 ring-offset-2' 
            : 'hover:shadow-lg'
          }
        `}
        style={{
          backgroundColor: selected ? colors.primary : colors.background,
          color: selected ? '#ffffff' : colors.text,
          border: `2px solid ${selected ? colors.primary : colors.secondary}`,
        }}
      >
        <p className="text-sm font-medium leading-relaxed break-words">
          {nodeData.node.text}
        </p>
        
        {nodeData.node.children.length > 0 && (
          <div className="absolute -right-3 top-1/2 -translate-y-1/2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
              style={{ backgroundColor: colors.secondary }}
            >
              {nodeData.node.children.length}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-300 !w-2 !h-2 !border-0"
      />
    </div>
  );
});

MindMapNode.displayName = 'MindMapNode';
