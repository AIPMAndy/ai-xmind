'use client';

import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { open as shellOpen } from '@tauri-apps/plugin-shell';

export interface TauriFileOperation {
  saveMindMap: (content: string, filename: string) => Promise<string>;
  loadMindMap: () => Promise<{ content: string; path: string } | null>;
  exportXMind: (content: Blob, filename: string) => Promise<string>;
}

export const tauriOperations: TauriFileOperation = {
  async saveMindMap(content: string, filename: string) {
    try {
      const filePath = await save({
        defaultPath: `${filename}.json`,
        filters: [{
          name: 'JSON Files',
          extensions: ['json']
        }]
      });
      
      if (filePath) {
        await writeTextFile(filePath, content);
        return filePath;
      }
      throw new Error('用户取消保存');
    } catch (error) {
      console.error('保存失败:', error);
      throw error;
    }
  },

  async loadMindMap() {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Mind Map Files',
          extensions: ['json', 'xmind']
        }]
      });

      if (selected && typeof selected === 'string') {
        const content = await readTextFile(selected);
        return { content, path: selected };
      }
      return null;
    } catch (error) {
      console.error('加载失败:', error);
      throw error;
    }
  },

  async exportXMind(content: Blob, filename: string) {
    try {
      const buffer = await content.arrayBuffer();
      const text = new TextDecoder().decode(buffer);
      
      const filePath = await save({
        defaultPath: `${filename}.xmind`,
        filters: [{
          name: 'XMind Files',
          extensions: ['xmind']
        }]
      });

      if (filePath) {
        await writeTextFile(filePath, text);
        return filePath;
      }
      throw new Error('用户取消导出');
    } catch (error) {
      console.error('导出失败:', error);
      throw error;
    }
  }
};

export const openExternalLink = async (url: string) => {
  try {
    await shellOpen(url);
  } catch (error) {
    console.error('打开链接失败:', error);
    window.open(url, '_blank');
  }
};

export const isTauriApp = () => {
  return typeof window !== 'undefined' && '__TAURI__' in window;
};

export const platform = {
  isMac: typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac'),
  isWindows: typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('win'),
  isLinux: typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('linux'),
};
