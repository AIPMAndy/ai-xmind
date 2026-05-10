import { MindNode, ThemeColor } from './types';
import { THEME_COLORS } from './ai-config';

export const getThemeColor = (theme: ThemeColor) => {
  return THEME_COLORS[theme] || THEME_COLORS.default;
};

export const countNodes = (nodes: MindNode[]): number => {
  return nodes.reduce((count, node) => {
    return count + 1 + (node.children ? countNodes(node.children) : 0);
  }, 0);
};

export const findNodeById = (
  nodes: MindNode[],
  id: string
): MindNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const findParentNode = (
  nodes: MindNode[],
  targetId: string
): MindNode | null => {
  for (const node of nodes) {
    for (const child of node.children) {
      if (child.id === targetId) return node;
    }
    if (node.children.length > 0) {
      const found = findParentNode(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
};

export const flattenNodes = (nodes: MindNode[]): MindNode[] => {
  const result: MindNode[] = [];
  const flatten = (nodeList: MindNode[]) => {
    for (const node of nodeList) {
      result.push(node);
      if (node.children.length > 0) {
        flatten(node.children);
      }
    }
  };
  flatten(nodes);
  return result;
};

export const generateNodePositions = (
  nodes: MindNode[],
  startX: number = 0,
  startY: number = 0,
  level: number = 0,
  horizontalGap: number = 200,
  verticalGap: number = 60
): MindNode[] => {
  const updatePositions = (
    nodeList: MindNode[],
    x: number,
    y: number,
    lvl: number
  ): MindNode[] => {
    const totalHeight = nodeList.length * verticalGap;
    const startYOffset = y - totalHeight / 2 + verticalGap / 2;

    return nodeList.map((node, index) => {
      const nodeY = startYOffset + index * verticalGap;
      const updatedNode: MindNode = {
        ...node,
        position: { x, y: nodeY },
        expanded: true,
      };

      if (node.children.length > 0) {
        const childX = lvl === 0 ? x + horizontalGap : x + horizontalGap * 0.7;
        updatedNode.children = updatePositions(
          node.children,
          childX,
          nodeY,
          lvl + 1
        );
      }

      return updatedNode;
    });
  };

  return updatePositions(nodes, startX, startY, level);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return `${Math.floor(diffDays / 30)}个月前`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
