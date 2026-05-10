'use client';

import { useState } from 'react';
import { useMindMapStore } from '@/lib/store';
import { MindMapCard } from '@/components/Dashboard/MindMapCard';
import { TemplateModal } from '@/components/Dashboard/TemplateModal';
import { ImportModal } from '@/components/Dashboard/ImportModal';
import { Button } from '@/components/UI/Button';
import { Brain, Plus, Sparkles, Layers, Zap, Shield, Upload, FileText, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { mindMaps } = useMindMapStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mindskill</h1>
                <p className="text-xs text-gray-500">智能思维导图工具</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                导入
              </Button>
              <Button onClick={() => setIsTemplateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                新建
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              让思维可视化
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              结合先进AI技术，快速创建、扩展和优化思维导图。比XMind更好用！
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI智能生成</h3>
              <p className="text-sm text-gray-600">输入主题，AI自动生成完整思维导图结构</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">XMind兼容</h3>
              <p className="text-sm text-gray-600">完美导入导出XMind格式文件</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">丰富模板</h3>
              <p className="text-sm text-gray-600">多种预设模板，快速开始创作</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">高效编辑</h3>
              <p className="text-sm text-gray-600">撤销重做、多种布局、流畅操作</p>
            </motion.div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">我的思维导图</h2>
              <p className="text-gray-600">共 {mindMaps.length} 个思维导图</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                导入XMind
              </Button>
              <Button onClick={() => setIsTemplateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                新建
              </Button>
            </div>
          </div>

          {mindMaps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">开始创建你的第一个思维导图</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                点击下方按钮，从空白画布或模板开始创建，或使用AI智能生成
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setIsTemplateModalOpen(true)} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  新建思维导图
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setIsImportModalOpen(true)}>
                  <Upload className="w-5 h-5 mr-2" />
                  导入XMind
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mindMaps.map((mindMap, index) => (
                <MindMapCard key={mindMap.id} mindMap={mindMap} index={index} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">为什么选择Mindskill?</h2>
              <p className="text-xl text-blue-100 mb-8">
                比XMind更强大，更智能，更易用
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI驱动</h3>
                  <p className="text-sm text-blue-100">GPT-4和Claude双引擎支持</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">格式兼容</h3>
                  <p className="text-sm text-blue-100">完美支持XMind文件格式</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">本地存储</h3>
                  <p className="text-sm text-blue-100">数据仅保存在本地浏览器</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
