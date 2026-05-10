export interface MindNode {
  id: string;
  text: string;
  children: MindNode[];
  position?: { x: number; y: number };
  style?: NodeStyle;
  collapsed?: boolean;
  expanded?: boolean;
}

export interface NodeStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  borderColor?: string;
}

export interface MindMap {
  id: string;
  title: string;
  nodes: MindNode[];
  settings: MindMapSettings;
  createdAt: string;
  updatedAt: string;
}

export interface MindMapSettings {
  layout: 'horizontal' | 'vertical' | 'tree';
  theme: ThemeColor;
  zoom: number;
}

export type ThemeColor = 'default' | 'ocean' | 'forest' | 'sunset' | 'berry';

export type AIModel = 
  | 'openai' 
  | 'anthropic' 
  | 'deepseek' 
  | 'zhipu' 
  | 'qwen' 
  | 'kimi' 
  | 'siliconflow';

export interface AIRequest {
  topic?: string;
  nodeText?: string;
  model: AIModel;
  depth?: number;
  count?: number;
}

export interface AIResponse {
  nodes?: MindNode[];
  children?: MindNode[];
  error?: string;
}
