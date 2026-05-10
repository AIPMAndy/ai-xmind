import { NextRequest, NextResponse } from 'next/server';
import { generateMindMap } from '@/lib/ai-service';
import { AIModel } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { topic, model, baseURL, customModel } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '主题不能为空' },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: '请选择AI模型' },
        { status: 400 }
      );
    }

    let nodes;

    if (model === 'anthropic') {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY!,
      });

      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          { error: '未配置 Anthropic API Key。请在环境变量中设置 ANTHROPIC_API_KEY' },
          { status: 500 }
        );
      }

      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `请为"${topic}"创建一个结构清晰的思维导图。包含中心主题和3-6个主要分支，每个主要分支包含2-4个子节点。请仅返回JSON格式的思维导图结构，不要包含任何其他文字。`,
          },
        ],
      });

      const content = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        nodes = parsed.children || [parsed];
      }
    } else {
      try {
        nodes = await generateMindMap(
          model as AIModel,
          topic,
          { baseURL, customModel }
        );
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || '生成失败，请检查API配置' },
          { status: 500 }
        );
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
