import { MindNode, MindMap } from './types';

export const XMIND_MANIFEST = {
  file: 'manifest.json',
  content: 'content.json',
  metadata: 'metadata.json',
};

export const XMindStyles = {
  themes: {
    default: {
      name: '经典蓝',
      colors: {
        root: '#3B82F6',
        branch1: '#3B82F6',
        branch2: '#10B981',
        branch3: '#F59E0B',
        branch4: '#EF4444',
        branch5: '#8B5CF6',
        branch6: '#EC4899',
      },
      fonts: {
        root: 18,
        branch: 14,
        leaf: 12,
      },
    },
    ocean: {
      name: '海洋蓝',
      colors: {
        root: '#0EA5E9',
        branch1: '#0EA5E9',
        branch2: '#06B6D4',
        branch3: '#14B8A6',
        branch4: '#22D3EE',
        branch5: '#38BDF8',
        branch6: '#7DD3FC',
      },
      fonts: {
        root: 18,
        branch: 14,
        leaf: 12,
      },
    },
    forest: {
      name: '森林绿',
      colors: {
        root: '#22C55E',
        branch1: '#22C55E',
        branch2: '#16A34A',
        branch3: '#15803D',
        branch4: '#166534',
        branch5: '#4ADE80',
        branch6: '#86EFAC',
      },
      fonts: {
        root: 18,
        branch: 14,
        leaf: 12,
      },
    },
    sunset: {
      name: '落日橙',
      colors: {
        root: '#F97316',
        branch1: '#F97316',
        branch2: '#FB923C',
        branch3: '#FDBA74',
        branch4: '#EA580C',
        branch5: '#FF8C00',
        branch6: '#FFA500',
      },
      fonts: {
        root: 18,
        branch: 14,
        leaf: 12,
      },
    },
    berry: {
      name: '浆果紫',
      colors: {
        root: '#A855F7',
        branch1: '#A855F7',
        branch2: '#C084FC',
        branch3: '#D946EF',
        branch4: '#E879F9',
        branch5: '#9333EA',
        branch6: '#7C3AED',
      },
      fonts: {
        root: 18,
        branch: 14,
        leaf: 12,
      },
    },
  },
};

export interface XMindContent {
  id: string;
  title: string;
  children?: XMindContent[];
  notes?: {
    plain?: {
      content?: string;
    };
  };
  markers?: string[];
  attributes?: Record<string, any>;
}

export interface XMindFile {
  manifest: {
    file: string;
    version: string;
  };
  content: {
    id: string;
    title: string;
    rootTopic: XMindContent;
  }[];
  metadata: {
    creator: {
      name: string;
      version: string;
    };
    created: string;
    modified: string;
  };
}

export class XMindParser {
  static async parse(file: File): Promise<MindMap> {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await this.extractZip(arrayBuffer);
    
    const contentJson = await this.getFileContent(zip, 'content.json');
    const metadataJson = await this.getFileContent(zip, 'metadata.json');
    
    const content = JSON.parse(contentJson);
    const metadata = JSON.parse(metadataJson);
    
    const rootTopic = content[0]?.rootTopic;
    const title = content[0]?.title || '未命名思维导图';
    
    const nodes = rootTopic ? this.parseTopicToNodes(rootTopic) : [];
    
    return {
      id: this.generateId(),
      title,
      nodes,
      settings: {
        layout: 'horizontal',
        theme: 'default',
        zoom: 1,
      },
      createdAt: metadata?.metadata?.created || new Date().toISOString(),
      updatedAt: metadata?.metadata?.modified || new Date().toISOString(),
    };
  }

  private static async extractZip(arrayBuffer: ArrayBuffer): Promise<Map<string, string>> {
    const files = new Map<string, string>();
    
    try {
      const JSZip = (await import('jszip')).default;
      const blob = new Blob([arrayBuffer], { type: 'application/zip' });
      const zip = await JSZip.loadAsync(blob);
      
      const fileEntries = Object.entries(zip.files);
      for (const [filename, file] of fileEntries) {
        if (!(file as any).dir) {
          const content = await (file as any).async('string');
          files.set(filename, content);
        }
      }
    } catch (error) {
      console.error('Failed to parse XMind file:', error);
      throw new Error('无法解析XMind文件，请确保是有效的.xmind文件');
    }
    
    return files;
  }

  private static async getFileContent(files: Map<string, string>, filename: string): Promise<string> {
    const content = files.get(filename);
    if (!content) {
      throw new Error(`XMind文件中缺少${filename}`);
    }
    return content;
  }

  private static parseTopicToNodes(topic: XMindContent): MindNode[] {
    const node: MindNode = {
      id: topic.id || this.generateId(),
      text: topic.title || '未命名节点',
      children: [],
      expanded: true,
    };

    if (topic.children && Array.isArray(topic.children)) {
      node.children = topic.children.map(child => 
        this.parseTopicToNodes(child)
      ).flat();
    }

    return [node];
  }

  static generateId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  static async export(mindMap: MindMap): Promise<Blob> {
    const xmindContent = this.createXMindContent(mindMap);
    
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    zip.file('META-INF/manifest.json', JSON.stringify({
      file: 'content.json',
      version: '1.0',
    }, null, 2));

    zip.file('content.json', JSON.stringify(xmindContent, null, 2));

    zip.file('metadata.json', JSON.stringify({
      metadata: {
        creator: {
          name: 'Mindskill',
          version: '1.0',
        },
        created: mindMap.createdAt,
        modified: new Date().toISOString(),
      },
    }, null, 2));

    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/xmind' });
    return blob;
  }

  private static createXMindContent(mindMap: MindMap): any {
    const rootTopic = mindMap.nodes[0]
      ? this.createTopic(mindMap.nodes[0])
      : { id: this.generateId(), title: mindMap.title };

    return [{
      id: this.generateId(),
      title: mindMap.title,
      rootTopic,
    }];
  }

  private static createTopic(node: MindNode): any {
    const topic: any = {
      id: node.id || this.generateId(),
      title: node.text,
    };

    if (node.children && node.children.length > 0) {
      topic.children = node.children.map(child => this.createTopic(child));
    }

    return topic;
  }
}

export const TEMPLATES = {
  blank: {
    name: '空白模板',
    description: '从零开始创建思维导图',
    nodes: [],
  },
  projectPlan: {
    name: '项目管理',
    description: '用于项目计划、任务分解',
    nodes: [{
      text: '项目名称',
      children: [
        { text: '项目目标', children: [] },
        { text: '团队成员', children: [] },
        { text: '时间线', children: [
          { text: '第一阶段', children: [] },
          { text: '第二阶段', children: [] },
          { text: '第三阶段', children: [] },
        ]},
        { text: '资源需求', children: [] },
        { text: '风险管理', children: [] },
      ],
    }],
  },
  studyPlan: {
    name: '学习计划',
    description: '用于知识学习和复习计划',
    nodes: [{
      text: '学习主题',
      children: [
        { text: '基础知识', children: [
          { text: '概念定义', children: [] },
          { text: '核心原理', children: [] },
        ]},
        { text: '进阶内容', children: [
          { text: '高级特性', children: [] },
          { text: '最佳实践', children: [] },
        ]},
        { text: '实践项目', children: [] },
        { text: '复习计划', children: [
          { text: '每日复习', children: [] },
          { text: '每周总结', children: [] },
        ]},
      ],
    }],
  },
  meetingNotes: {
    name: '会议纪要',
    description: '用于记录会议内容和待办事项',
    nodes: [{
      text: '会议主题',
      children: [
        { text: '参会人员', children: [] },
        { text: '会议议程', children: [] },
        { text: '讨论要点', children: [] },
        { text: '决议事项', children: [] },
        { text: '待办任务', children: [
          { text: '任务1', children: [] },
          { text: '任务2', children: [] },
        ]},
      ],
    }],
  },
  swot: {
    name: 'SWOT分析',
    description: '用于战略分析和商业规划',
    nodes: [{
      text: 'SWOT分析',
      children: [
        { text: '优势 (S)', children: [
          { text: '内部优势1', children: [] },
          { text: '内部优势2', children: [] },
        ]},
        { text: '劣势 (W)', children: [
          { text: '内部劣势1', children: [] },
          { text: '内部劣势2', children: [] },
        ]},
        { text: '机会 (O)', children: [
          { text: '外部机会1', children: [] },
          { text: '外部机会2', children: [] },
        ]},
        { text: '威胁 (T)', children: [
          { text: '外部威胁1', children: [] },
          { text: '外部威胁2', children: [] },
        ]},
      ],
    }],
  },
  goalSetting: {
    name: '目标设定',
    description: '用于个人或团队目标规划',
    nodes: [{
      text: '长期目标',
      children: [
        { text: '年度目标', children: [
          { text: '季度目标', children: [
            { text: '月度计划', children: [
              { text: '周计划', children: [] },
            ]},
          ]},
        ]},
        { text: '资源支持', children: [] },
        { text: '衡量标准', children: [] },
      ],
    }],
  },
};
