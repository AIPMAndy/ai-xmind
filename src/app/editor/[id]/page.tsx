'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMindMapStore } from '@/lib/store';
import { EnhancedCanvas } from '@/components/MindMap/EnhancedCanvas';
import { EnhancedToolbar } from '@/components/MindMap/EnhancedToolbar';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const id = params.id as string;
  const { mindMaps, setCurrentMindMap, currentMindMap } = useMindMapStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const mindMap = mindMaps.find((m) => m.id === id);
      if (mindMap) {
        setCurrentMindMap(id);
        setIsLoaded(true);
      } else {
        setIsLoaded(true);
      }
    }
  }, [id, mindMaps, setCurrentMindMap]);

  const handleSave = () => {
    if (currentMindMap) {
      useMindMapStore.getState().updateMindMap(currentMindMap.id, {
        nodes: currentMindMap.nodes,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!currentMindMap) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">思维导图不存在</p>
          <a href="/" className="text-blue-600 hover:underline">返回首页</a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <EnhancedToolbar onSave={handleSave} />
      <div className="flex-1 overflow-hidden">
        <EnhancedCanvas />
      </div>
    </div>
  );
}
