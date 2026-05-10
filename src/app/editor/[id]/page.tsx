'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMindMapStore } from '@/lib/store';
import { Canvas } from '@/components/MindMap/Canvas';
import { Toolbar } from '@/components/MindMap/Toolbar';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const id = params.id as string;
  const { mindMaps, setCurrentMindMap, currentMindMap } = useMindMapStore();

  useEffect(() => {
    if (id) {
      const mindMap = mindMaps.find((m) => m.id === id);
      if (mindMap) {
        setCurrentMindMap(id);
      }
    }
  }, [id, mindMaps, setCurrentMindMap]);

  if (!currentMindMap) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />
      <div className="flex-1 overflow-hidden">
        <Canvas />
      </div>
    </div>
  );
}
