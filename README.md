# Mindskill - 智能思维导图工具

结合先进AI技术的智能思维导图工具，帮助用户快速创建、扩展和优化思维导图。

## 功能特点

- **AI智能生成**：输入主题，AI自动生成完整的思维导图结构
- **智能扩展**：选中任意节点，AI智能扩展子节点
- **多AI支持**：支持 DeepSeek、OpenAI GPT、Claude、智谱GLM、通义千问、Kimi等
- **XMind兼容**：完美导入导出XMind格式文件
- **高效编辑**：直观的可视化界面，支持拖拽、缩放、多主题切换
- **撤销重做**：支持50步历史记录
- **本地存储**：数据仅存储在本地浏览器，保护隐私
- **导出功能**：支持导出为XMind和JSON格式

## 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript
- **UI库**：Tailwind CSS + Lucide React
- **思维导图**：React Flow
- **AI集成**：支持7大AI模型提供商
- **状态管理**：Zustand
- **动画**：Framer Motion

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/AIPMAndy/mindskill.git
cd mindskill
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件并添加你的API密钥：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，添加你需要的AI API密钥：

```env
# DeepSeek (推荐)
DEEPSEEK_API_KEY=your-deepseek-api-key

# 或其他模型
OPENAI_API_KEY=your-openai-api-key
ZHIPU_API_KEY=your-zhipu-api-key
QWEN_API_KEY=your-qwen-api-key
KIMI_API_KEY=your-kimi-api-key
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 使用说明

### 创建思维导图

1. 点击首页的"新建"按钮
2. 选择模板（空白、项目管理、学习计划等）
3. 输入思维导图标题
4. 开始编辑

### AI生成

1. 点击工具栏的"AI创建"按钮
2. 输入你想要探索的主题
3. 选择AI模型提供商（推荐DeepSeek）
4. 点击"开始生成"

### AI扩展节点

1. 选中你想要扩展的节点
2. 点击工具栏的"AI扩展"按钮
3. 设置子节点数量
4. 选择AI模型并点击"开始扩展"

### XMind导入导出

- **导入**：点击"导入"按钮，拖拽上传.xmind文件
- **导出**：点击"导出"按钮，选择XMind或JSON格式

## 部署

项目已优化，可部署到 Vercel：

```bash
npm run build
```

## 获取API密钥

### 国产模型（推荐）
- **DeepSeek**: [https://platform.deepseek.com/](https://platform.deepseek.com/)
- **智谱GLM**: [https://open.bigmodel.cn/](https://open.bigmodel.cn/)
- **通义千问**: [https://dashscope.console.aliyun.com/](https://dashscope.console.aliyun.com/)
- **Kimi Moonshot**: [https://platform.moonshot.cn/](https://platform.moonshot.cn/)
- **SiliconFlow**: [https://www.siliconflow.cn/](https://www.siliconflow.cn/)

### 国际模型
- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic**: [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

## License

MIT License
