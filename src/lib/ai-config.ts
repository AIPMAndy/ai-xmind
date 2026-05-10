import { AIModel } from './types';

export const AI_CONFIGS = {
  openai: {
    name: 'OpenAI GPT',
    description: 'GPT-4 powered intelligence',
    icon: '🤖',
    provider: 'OpenAI',
  },
  anthropic: {
    name: 'Anthropic Claude',
    description: 'Claude 3 powered intelligence',
    icon: '🧠',
    provider: 'Anthropic',
  },
  deepseek: {
    name: 'DeepSeek',
    description: 'DeepSeek V3 / R1 国产高性能模型',
    icon: '🔮',
    provider: 'DeepSeek',
  },
  zhipu: {
    name: '智谱 GLM',
    description: 'GLM-4 国产大语言模型',
    icon: '✨',
    provider: 'ZhipuAI',
  },
  qwen: {
    name: '通义千问',
    description: 'Qwen2.5 阿里大模型',
    icon: '🌐',
    provider: 'Alibaba',
  },
  kimi: {
    name: 'Kimi Moonshot',
    description: 'Kimi 大模型',
    icon: '🌙',
    provider: 'Moonshot',
  },
  siliconflow: {
    name: 'SiliconFlow (聚合)',
    description: '聚合多个模型，支持DeepSeek/智谱等',
    icon: '⚡',
    provider: 'SiliconFlow',
  },
};

export const MODEL_OPTIONS = {
  openai: [
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '最强能力' },
    { id: 'gpt-4', name: 'GPT-4', description: '高性能' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速响应' },
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: '最新最强' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: '最高智能' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: '均衡之选' },
  ],
  deepseek: [
    { id: 'deepseek-chat', name: 'DeepSeek V3', description: '最新版本' },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', description: '代码专家' },
  ],
  zhipu: [
    { id: 'glm-4', name: 'GLM-4', description: '最新版本' },
    { id: 'glm-4-flash', name: 'GLM-4 Flash', description: '快速响应' },
  ],
  qwen: [
    { id: 'qwen-turbo', name: 'Qwen Turbo', description: '快速版本' },
    { id: 'qwen-plus', name: 'Qwen Plus', description: '增强版本' },
    { id: 'qwen-max', name: 'Qwen Max', description: '最强版本' },
  ],
  kimi: [
    { id: 'moonshot-v1-8k', name: 'Kimi 8K', description: '上下文8K' },
    { id: 'moonshot-v1-32k', name: 'Kimi 32K', description: '上下文32K' },
    { id: 'moonshot-v1-128k', name: 'Kimi 128K', description: '超长上下文' },
  ],
  siliconflow: [
    { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3', description: '高性能' },
    { id: 'deepseek-ai/DeepSeek-R1', name: 'DeepSeek R1', description: '推理模型' },
    { id: 'THUDM/glm-z1-9b', name: 'GLM-Z1-9B', description: '智谱轻量' },
    { id: 'Qwen/Qwen2.5-7B-Instruct', name: 'Qwen2.5-7B', description: '阿里轻量' },
  ],
};

export const PROMPTS = {
  generate: (topic: string) => `
请为"${topic}"创建一个结构清晰的思维导图。
要求：
- 包含中心主题和3-6个主要分支
- 每个主要分支包含2-4个子节点
- 使用层级结构展示主题
- 确保逻辑清晰、层次分明
请仅返回JSON格式的思维导图结构，格式如下（不要包含任何其他文字）：
{
  "text": "中心主题",
  "children": [
    {
      "text": "分支1",
      "children": [
        {"text": "子节点1", "children": []},
        {"text": "子节点2", "children": []}
      ]
    }
  ]
}
`,

  expand: (nodeText: string, count: number) => `
基于"${nodeText}"，生成${count}个相关的子节点。
要求：
- 每个子节点简洁明了，控制在15个字以内
- 体现逻辑递进或并列关系
- 适合作为"${nodeText}"的细化内容
请仅返回JSON数组格式（不要包含任何其他文字）：
[
  {"text": "子节点1", "children": []},
  {"text": "子节点2", "children": []}
]
`,

  optimize: (nodes: any) => `
请分析以下思维导图结构，并提出优化建议。
${JSON.stringify(nodes, null, 2)}
请返回优化后的思维导图结构（JSON格式）。
`,
};

export const THEME_COLORS = {
  default: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    background: '#EFF6FF',
    text: '#1E40AF',
    gradient: 'from-blue-500 to-blue-600',
  },
  ocean: {
    primary: '#06B6D4',
    secondary: '#22D3EE',
    background: '#ECFEFF',
    text: '#0E7490',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  forest: {
    primary: '#10B981',
    secondary: '#34D399',
    background: '#ECFDF5',
    text: '#047857',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  sunset: {
    primary: '#F59E0B',
    secondary: '#FBBF24',
    background: '#FFFBEB',
    text: '#B45309',
    gradient: 'from-amber-500 to-amber-600',
  },
  berry: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    background: '#F5F3FF',
    text: '#6D28D9',
    gradient: 'from-violet-500 to-violet-600',
  },
};

export const DEFAULT_NODE_STYLE = {
  borderRadius: 12,
  padding: '12px 16px',
  minWidth: 100,
  maxWidth: 300,
};
