# AI版Xmind - 智能思维导图工具

## 1. 项目概述与目标

### 项目简介
AI版Xmind是一款结合人工智能技术的智能思维导图工具，帮助用户快速创建、扩展和优化思维导图。通过集成先进的AI大语言模型（GPT和Claude），用户可以：
- 从零开始AI生成思维导图
- 智能扩展现有思维导图
- AI优化和重构导图结构
- 自动总结和归纳要点

### 核心价值
- **效率提升**：AI辅助生成，大幅减少手动创建时间
- **结构优化**：智能建议最佳思维结构
- **创意激发**：AI提供多样化的思维角度
- **易于使用**：直观的可视化界面，零学习成本

## 2. 技术栈选择

### 前端框架
- **Next.js 14**（App Router）
- **React 18**
- **TypeScript 5**

### UI组件库
- **Tailwind CSS**（样式和布局）
- **Lucide React**（图标库）
- **Radix UI**（无障碍组件基础）

### 思维导图渲染
- **React Flow**（核心思维导图渲染引擎）
- 自定义节点和边样式

### AI集成
- **OpenAI API**（GPT-4/GPT-3.5）
- **Anthropic API**（Claude 3）
- 支持用户选择AI模型

### 状态管理
- **Zustand**（轻量级状态管理）
- **React Context**（主题和设置）

### 其他工具
- **Framer Motion**（动画效果）
- **localStorage**（本地数据持久化）

## 3. 功能架构

### 核心功能模块

#### 3.1 思维导图管理
- 创建新的思维导图（空白或AI生成）
- 打开/导入现有思维导图
- 保存思维导图（自动保存 + 手动保存）
- 导出为JSON格式
- 思维导图列表管理

#### 3.2 思维导图编辑
- 添加中心主题和分支节点
- 编辑节点文本内容
- 删除节点（支持多选）
- 拖拽调整节点位置
- 展开/折叠子节点
- 快捷键支持（Enter添加同级，Tab添加子节点）

#### 3.3 AI生成功能
- **AI创建**：输入主题，AI一键生成完整思维导图
- **AI扩展**：选中节点，AI智能扩展子节点
- **AI优化**：AI分析并优化导图结构
- **AI解释**：选中节点，AI生成详细解释
- 模型选择：OpenAI GPT / Anthropic Claude

#### 3.4 视图和样式
- 多种布局模式：水平、垂直、树状
- 主题颜色切换（预设5种主题）
- 节点样式自定义（字体大小、颜色）
- 缩放和平移导航
- 全屏模式

### 用户交互流程

#### 创建新思维导图
1. 用户点击"新建"按钮
2. 选择创建方式：
   - 空白画布：从中心节点开始
   - AI创建：输入主题，AI生成
3. 进入编辑界面

#### AI生成思维导图
1. 用户输入主题/问题
2. 选择AI模型
3. 点击生成
4. AI返回结构化数据
5. 自动渲染为思维导图

#### AI扩展节点
1. 用户选中某个节点
2. 点击"AI扩展"按钮
3. 输入扩展要求（可选）
4. AI生成子节点
5. 自动添加到选中节点下

## 4. 数据模型设计

### 思维导图数据结构
```typescript
interface MindMap {
  id: string;
  title: string;
  nodes: MindNode[];
  settings: MindMapSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface MindNode {
  id: string;
  text: string;
  children: MindNode[];
  position?: { x: number; y: number };
  style?: NodeStyle;
  collapsed?: boolean;
  expanded?: boolean;
}

interface MindMapSettings {
  layout: 'horizontal' | 'vertical' | 'tree';
  theme: 'default' | 'blue' | 'green' | 'purple' | 'orange';
  zoom: number;
}
```

### API设计（Next.js API Routes）

#### AI生成端点
- `POST /api/ai/generate`
  - 输入：{ topic, model, depth }
  - 输出：{ nodes: MindNode[] }

- `POST /api/ai/expand`
  - 输入：{ nodeText, model, count }
  - 输出：{ children: MindNode[] }

- `POST /api/ai/optimize`
  - 输入：{ nodes, model }
  - 输出：{ optimizedNodes: MindNode[] }

## 5. UI/UX设计

### 页面结构

#### 首页（Dashboard）
- 顶部导航栏
  - Logo和标题
  - 新建思维导图按钮
  - 设置按钮
- 思维导图列表
  - 卡片式展示
  - 缩略图预览
  - 创建时间
  - 操作按钮（打开、删除）
- 快捷操作区
  - 快速AI创建入口

#### 编辑页（Editor）
- 顶部工具栏
  - 返回按钮
  - 标题编辑
  - 保存状态
  - AI功能按钮
  - 设置按钮
- 左侧边栏（可选）
  - 思维导图缩略图
  - 节点列表
- 主画布区域
  - 思维导图视图
  - 缩放控制
- 底部状态栏
  - 节点数量
  - 当前缩放级别

### 设计风格
- **风格**：现代简约、专业工具感
- **配色**：浅色主题为主，深色背景突出内容
- **字体**：Inter（UI）、JetBrains Mono（代码）
- **间距**：8px基础网格系统
- **圆角**：8px（卡片）、4px（按钮）
- **阴影**：柔和阴影增加层次感

### 主题颜色
1. **Default**：#3B82F6（蓝色）
2. **Ocean**：#06B6D4（青色）
3. **Forest**：#10B981（绿色）
4. **Sunset**：#F59E0B（橙色）
5. **Berry**：#8B5CF6（紫色）

### 动画设计
- 页面切换：淡入淡出 300ms
- 节点展开：弹性动画 400ms
- 工具提示：延迟200ms显示
- 加载状态：脉冲动画
- AI生成：打字机效果展示

## 6. AI Prompt设计

### AI创建思维导图
```
请为"{topic}"创建一个结构清晰的思维导图。
要求：
- 包含中心主题和3-5个主要分支
- 每个主要分支包含2-4个子节点
- 使用层级结构展示主题
- 确保逻辑清晰、层次分明
请以JSON格式返回思维导图结构。
```

### AI扩展节点
```
基于"{nodeText}"，生成{count}个相关的子节点。
要求：
- 每个子节点简洁明了
- 体现逻辑递进关系
- 适合作为"{nodeText}"的细化内容
请以JSON数组格式返回。
```

## 7. 项目文件结构

```
ai-xmind/
├── app/
│   ├── page.tsx（首页）
│   ├── editor/[id]/page.tsx（编辑页）
│   ├── api/
│   │   └── ai/
│   │       ├── generate/route.ts
│   │       ├── expand/route.ts
│   │       └── optimize/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── MindMap/
│   │   ├── Canvas.tsx
│   │   ├── Node.tsx
│   │   └── Toolbar.tsx
│   ├── Dashboard/
│   │   ├── MindMapCard.tsx
│   │   └── CreateModal.tsx
│   ├── AI/
│   │   ├── AIGenerateModal.tsx
│   │   └── AIExpandModal.tsx
│   └── UI/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── lib/
│   ├── store.ts（Zustand状态管理）
│   ├── types.ts（类型定义）
│   ├── ai-config.ts（AI配置）
│   └── utils.ts（工具函数）
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── SPEC.md
└── README.md
```

## 8. 部署和配置

### 环境变量
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### 部署平台
- Vercel（推荐）
- 支持Serverless函数
- 自动边缘部署

## 9. 后续迭代计划

### Phase 1（当前版本）
- ✅ 基础思维导图创建和编辑
- ✅ AI生成思维导图
- ✅ AI扩展节点
- ✅ 本地数据持久化

### Phase 2
- 🚧 导出功能（PNG、PDF、Markdown）
- 🚧 多人协作
- 🚧 模板市场

### Phase 3
- 🚧 云端同步
- 🚧 版本历史
- 🚧 自定义AI提示词模板
