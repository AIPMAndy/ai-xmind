import { NextRequest, NextResponse } from 'next/server';
import { PROMPTS } from '@/lib/ai-config';
import { MindNode } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { topic, model } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '主题不能为空' },
        { status: 400 }
      );
    }

    let nodes: MindNode[] = [];

    if (model === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: '未配置 OpenAI API Key。请在环境变量中设置 OPENAI_API_KEY' },
          { status: 500 }
        );
      }

      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的思维导图生成助手。请根据用户输入的主题生成结构清晰的思维导图JSON数据。',
          },
          {
            role: 'user',
            content: PROMPTS.generate(topic),
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          nodes = addIdsToNodes(parsed.children || [parsed]);
        }
      }
    } else if (model === 'anthropic') {
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          { error: '未配置 Anthropic API Key。请在环境变量中设置 ANTHROPIC_API_KEY' },
          { status: 500 }
        );
      }

      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: PROMPTS.generate(topic),
          },
        ],
      });

      const content = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        nodes = addIdsToNodes(parsed.children || [parsed]);
      }
    }

    return NextResponse.json({ nodes });
  } catch (error: any) {
    console.error('AI Generate Error:', error);
    return NextResponse.json(
      { error: error.message || '生成失败，请重试' },
      { status: 500 }
    );
  }
}

function addIdsToNodes(nodes: any[]): MindNode[] {
  return nodes.map((node) => ({
    id: uuidv4(),
    text: node.text,
    children: node.children ? addIdsToNodes(node.children) : [],
    expanded: true,
  }));
}
