import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { PROMPTS } from '@/lib/ai-config';
import { MindNode } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { nodeText, count = 4, model } = await request.json();

    if (!nodeText) {
      return NextResponse.json(
        { error: '节点文本不能为空' },
        { status: 400 }
      );
    }

    let children: MindNode[] = [];

    if (model === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: '未配置 OpenAI API Key' },
          { status: 500 }
        );
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的思维导图生成助手。请根据父节点内容生成相关的子节点。',
          },
          {
            role: 'user',
            content: PROMPTS.expand(nodeText, count),
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          children = addIdsToNodes(parsed);
        }
      }
    } else if (model === 'anthropic') {
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          { error: '未配置 Anthropic API Key' },
          { status: 500 }
        );
      }

      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: PROMPTS.expand(nodeText, count),
          },
        ],
      });

      const content = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';

      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        children = addIdsToNodes(parsed);
      }
    }

    return NextResponse.json({ children });
  } catch (error) {
    console.error('AI Expand Error:', error);
    return NextResponse.json(
      { error: '扩展失败，请重试' },
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
