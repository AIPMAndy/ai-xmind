import { AIModel } from './types';

export const AI_CONFIGS = {
  openai: {
    name: 'OpenAI GPT',
    description: 'GPT-4 powered intelligence',
    icon: '🤖',
  },
  anthropic: {
    name: 'Anthropic Claude',
    description: 'Claude 3 powered intelligence',
    icon: '🧠',
  },
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
