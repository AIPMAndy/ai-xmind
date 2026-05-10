import { NextRequest, NextResponse } from 'next/server';
import { expandNode } from '@/lib/ai-service';
import { AIModel } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { nodeText, count = 4, model, baseURL, customModel } = await request.json();

    if (!nodeText) {
      return NextResponse.json(
        { error: '节点文本不能为空' },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: '请选择AI模型' },
        { status: 400 }
      );
    }

    let children;

    if (model === 'anthropic') {
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
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `基于"${nodeText}"，生成${count}个相关的子节点。每个子节点简洁明了，控制在15个字以内。请仅返回JSON数组格式，不要包含任何其他文字。`,
          },
        ],
      });

      const content = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';

      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        children = JSON.parse(jsonMatch[0]);
      }
    } else {
      try {
        children = await expandNode(
          model as AIModel,
          nodeText,
          count,
          { baseURL, customModel }
        );
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || '扩展失败，请检查API配置' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ children });
  } catch (error: any) {
    console.error('AI Expand Error:', error);
    return NextResponse.json(
      { error: error.message || '扩展失败，请重试' },
      { status: 500 }
    );
  }
}
