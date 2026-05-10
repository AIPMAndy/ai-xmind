import { MindNode, AIModel } from './types';
import { PROMPTS } from './ai-config';
import { v4 as uuidv4 } from 'uuid';

const API_ENDPOINTS = {
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  kimi: 'https://api.moonshot.cn/v1/chat/completions',
  siliconflow: 'https://api.siliconflow.cn/v1/chat/completions',
};

export async function callAI(
  model: AIModel,
  prompt: string,
  options?: {
    baseURL?: string;
    customModel?: string;
  }
): Promise<string> {
  let apiKey: string | undefined;
  let endpoint: string;
  let modelId: string;

  switch (model) {
    case 'deepseek':
      apiKey = process.env.DEEPSEEK_API_KEY;
      endpoint = API_ENDPOINTS.deepseek;
      modelId = options?.customModel || 'deepseek-chat';
      break;
    case 'zhipu':
      apiKey = process.env.ZHIPU_API_KEY;
      endpoint = API_ENDPOINTS.zhipu;
      modelId = options?.customModel || 'glm-4';
      break;
    case 'qwen':
      apiKey = process.env.QWEN_API_KEY;
      endpoint = API_ENDPOINTS.qwen;
      modelId = options?.customModel || 'qwen-turbo';
      break;
    case 'kimi':
      apiKey = process.env.KIMI_API_KEY;
      endpoint = API_ENDPOINTS.kimi;
      modelId = options?.customModel || 'moonshot-v1-8k';
      break;
    case 'siliconflow':
      apiKey = process.env.SILICONFLOW_API_KEY;
      endpoint = API_ENDPOINTS.siliconflow;
      modelId = options?.customModel || 'deepseek-ai/DeepSeek-V3';
      break;
    case 'openai':
      apiKey = process.env.OPENAI_API_KEY;
      endpoint = options?.baseURL || 'https://api.openai.com/v1/chat/completions';
      modelId = options?.customModel || 'gpt-4';
      break;
    case 'anthropic':
      throw new Error('Anthropic 需要使用专门的 SDK');
    default:
      throw new Error(`不支持的模型: ${model}`);
  }

  if (!apiKey) {
    throw new Error(`未配置 ${model} 的 API Key`);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的思维导图生成助手。请根据用户输入的主题生成结构清晰的思维导图JSON数据。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API请求失败: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function generateMindMap(
  model: AIModel,
  topic: string,
  options?: { baseURL?: string; customModel?: string }
): Promise<MindNode[]> {
  const prompt = PROMPTS.generate(topic);
  const content = await callAI(model, prompt, options);
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI返回内容不是有效的JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return addIdsToNodes(parsed.children || [parsed]);
}

export async function expandNode(
  model: AIModel,
  nodeText: string,
  count: number,
  options?: { baseURL?: string; customModel?: string }
): Promise<MindNode[]> {
  const prompt = PROMPTS.expand(nodeText, count);
  const content = await callAI(model, prompt, options);
  
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('AI返回内容不是有效的JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return addIdsToNodes(parsed);
}

function addIdsToNodes(nodes: any[]): MindNode[] {
  return nodes.map((node) => ({
    id: uuidv4(),
    text: node.text,
    children: node.children ? addIdsToNodes(node.children) : [],
    expanded: true,
  }));
}
