'use client';

import { useState } from 'react';
import { useMindMapStore } from '@/lib/store';
import { MindMapCard } from '@/components/Dashboard/MindMapCard';
import { CreateModal } from '@/components/Dashboard/CreateModal';
import { Button } from '@/components/UI/Button';
import { Brain, Plus, Sparkles, Layers, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { mindMaps } = useMindMapStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI XMind</h1>
                <p className="text-xs text-gray-500">智能思维导图工具</p>
              </div>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新建思维导图
            </Button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 特性介绍 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              让思维可视化
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              结合先进AI技术，快速创建、扩展和优化你的思维导图
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI智能生成
              </h3>
              <p className="text-gray-600 leading-relaxed">
                输入主题，AI自动生成完整的思维导图结构，省去手动整理的繁琐
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                智能扩展
              </h3>
              <p className="text-gray-600 leading-relaxed">
                选中任意节点，AI智能扩展子节点，让你的思维更加丰富完整
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                高效编辑
              </h3>
              <p className="text-gray-600 leading-relaxed">
                直观的可视化界面，支持拖拽、缩放、多主题切换，操作流畅自如
              </p>
            </motion.div>
          </div>
        </section>

        {/* 思维导图列表 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                我的思维导图
              </h2>
              <p className="text-gray-600">
                共 {mindMaps.length} 个思维导图
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              新建
            </Button>
          </div>

          {mindMaps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                开始创建你的第一个思维导图
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                点击下方按钮，选择空白画布或使用AI智能生成，快速创建思维导图
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                新建思维导图
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mindMaps.map((mindMap, index) => (
                <MindMapCard key={mindMap.id} mindMap={mindMap} index={index} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>数据仅存储在本地浏览器</span>
            </div>
            <div>Powered by OpenAI & Anthropic</div>
          </div>
        </div>
      </footer>

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
