# Mindskill - 智能思维导图工具

结合先进AI技术的智能思维导图工具，帮助用户快速创建、扩展和优化思维导图。

## 🎯 功能特点

- **AI智能生成**：输入主题，AI自动生成完整的思维导图结构
- **智能扩展**：选中任意节点，AI智能扩展子节点
- **多AI支持**：支持 DeepSeek、OpenAI GPT、Claude、智谱GLM、通义千问、Kimi等
- **XMind兼容**：完美导入导出XMind格式文件
- **高效编辑**：直观的可视化界面，支持拖拽、缩放、多主题切换
- **撤销重做**：支持50步历史记录
- **本地存储**：数据仅存储在本地，保护隐私
- **导出功能**：支持导出为XMind和JSON格式

## 📦 多平台支持

### Web应用
支持所有现代浏览器，直接访问使用。

### Mac桌面应用 🍎
支持 macOS（含 Apple Silicon M芯片）和 Intel芯片的Mac电脑。

### Windows桌面应用 🪟
支持 Windows 10/11 系统。

## 🚀 快速开始

### 方式一：直接使用Web版

访问在线版本即可使用，无需安装任何软件。

### 方式二：下载桌面应用

#### Mac (推荐)
1. 前往 [Releases 页面](https://github.com/AIPMAndy/mindskill/releases)
2. 下载 `.dmg` 安装包
3. 打开并拖拽到 Applications 文件夹
4. 首次运行需要在系统偏好设置中允许运行

#### Windows
1. 前往 [Releases 页面](https://github.com/AIPMAndy/mindskill/releases)
2. 下载 `.msi` 或 `.exe` 安装包
3. 运行安装程序

### 方式三：从源码运行

#### 前置要求
- Node.js 18+
- Rust 1.77+
- npm 或 yarn

#### Web开发模式
```bash
# 克隆项目
git clone https://github.com/AIPMAndy/mindskill.git
cd mindskill

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开 http://localhost:3000
```

#### 桌面应用开发模式
```bash
# 安装依赖
npm install

# 启动Tauri开发模式
npm run tauri:dev
```

## 🛠️ 配置AI API

### 配置环境变量

创建 `.env.local` 文件：

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
SILICONFLOW_API_KEY=your-siliconflow-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 获取API密钥

#### 国产模型（推荐）
- **DeepSeek**: [https://platform.deepseek.com/](https://platform.deepseek.com/)
- **智谱GLM**: [https://open.bigmodel.cn/](https://open.bigmodel.cn/)
- **通义千问**: [https://dashscope.console.aliyun.com/](https://dashscope.console.aliyun.com/)
- **Kimi Moonshot**: [https://platform.moonshot.cn/](https://platform.moonshot.cn/)
- **SiliconFlow**: [https://www.siliconflow.cn/](https://www.siliconflow.cn/)

#### 国际模型
- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic**: [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

## 📱 使用说明

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

## 🔧 构建桌面应用

```bash
# 安装依赖
npm install

# 构建Mac应用
npm run tauri:build -- --target universal-apple-darwin

# 构建Windows应用
npm run tauri:build -- --target x86_64-pc-windows-msvc
```

构建完成后，应用将位于 `src-tauri/target/release/bundle/` 目录下。

## 🏗️ 技术栈

- **框架**：Next.js 16 (App Router)
- **桌面**：Tauri 2 (Rust)
- **语言**：TypeScript
- **UI库**：Tailwind CSS + Lucide React
- **思维导图**：React Flow
- **AI集成**：支持7大AI模型提供商
- **状态管理**：Zustand
- **动画**：Framer Motion

## 📄 License

MIT License
