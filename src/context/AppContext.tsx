import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Page, Workspace, Block, Template, RoadmapTask, CalendarEvent, Notification } from '../types';

interface AppContextType {
  workspace: Workspace;
  pages: Page[];
  blocks: Block[];
  templates: Template[];
  selectedPageId: string | null;
  selectedTemplateId: string | null;
  roadmapTasks: RoadmapTask[];
  calendarEvents: CalendarEvent[];
  notifications: Notification[];
  isSidebarCollapsed: boolean;
  updateWorkspaceName: (name: string) => void;
  updatePageTitle: (pageId: string, title: string) => void;
  updatePageIcon: (pageId: string, icon: string) => void;
  addPage: (parentId?: string) => void;
  deletePage: (pageId: string) => void;
  selectPage: (pageId: string) => void;
  selectTemplate: (templateId: string) => void;
  togglePageExpansion: (pageId: string) => void;
  toggleSidebar: () => void;
  getPageBlocks: (pageId: string) => Block[];
  getChildBlocks: (parentBlockId: string) => Block[];
  addBlock: (pageId: string, afterBlockId?: string, parentBlockId?: string) => Block;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  toggleBlockExpansion: (blockId: string) => void;
  addRoadmapTask: (task: Omit<RoadmapTask, 'id'>) => void;
  updateRoadmapTask: (taskId: string, updates: Partial<RoadmapTask>) => void;
  deleteRoadmapTask: (taskId: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (eventId: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateUniqueId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const initialWorkspace: Workspace = { id: 'workspace-1', name: 'Quantum' };
const initialPages: Page[] = [
  { id: 'page-1', title: 'Welcome', parentId: null, createdAt: new Date('2025-01-01'), isExpanded: true, icon: '👋' },
  { id: 'page-project-a', title: 'Project A', parentId: null, createdAt: new Date('2025-01-02'), isExpanded: true, icon: '🚀' },
  { id: 'page-sub-1', title: 'Design Specs', parentId: 'page-project-a', createdAt: new Date('2025-01-03'), isExpanded: false, icon: '🎨' },
  { id: 'page-sub-2', title: 'Roadmap', parentId: 'page-project-a', createdAt: new Date('2025-01-04'), isExpanded: false, icon: '🗺️' },
];
const initialTemplates: Template[] = [
  { id: 'template-roadmap', name: 'Roadmap', icon: '🗺️', description: 'Plan and track project milestones', type: 'roadmap' },
  { id: 'template-calendar', name: 'Calendar', icon: '📅', description: 'Organize events and deadlines', type: 'calendar' },
];
const initialRoadmapTasks: RoadmapTask[] = [];
const initialCalendarEvents: CalendarEvent[] = [];
const initialBlocks: Block[] = [
    { id: 'block-1', type: 'heading', content: 'Welcome to your enhanced workspace!', pageId: 'page-1' },
    { id: 'block-2', type: 'text', content: 'This block editor now supports rich content types. Try typing "/" to see all available block types.', pageId: 'page-1' },
    { id: 'block-pa-1', type: 'heading', content: 'Project A Kick-off', pageId: 'page-project-a' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [templates] = useState<Template[]>(initialTemplates);
  const [selectedPageId, setSelectedPageId] = useState<string | null>('page-project-a');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>(initialRoadmapTasks);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateUniqueId('notification');
    const newNotification = { ...notification, id };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  const updateWorkspaceName = useCallback((name: string) => setWorkspace(prev => ({ ...prev, name })), []);
  const updatePageTitle = useCallback((pageId: string, title: string) => setPages(prev => prev.map(p => p.id === pageId ? { ...p, title } : p)), []);
  const updatePageIcon = useCallback((pageId: string, icon: string) => setPages(prev => prev.map(p => p.id === pageId ? { ...p, icon } : p)), []);
  const toggleSidebar = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);

  const addPage = useCallback((parentId?: string) => {
    const newPage: Page = { id: generateUniqueId('page'), title: 'Untitled', parentId: parentId || null, createdAt: new Date(), isExpanded: false, icon: '📄' };
    setPages(prev => {
      let updated = [...prev, newPage];
      if (parentId) updated = updated.map(p => p.id === parentId ? { ...p, isExpanded: true } : p);
      return updated;
    });
    setSelectedPageId(newPage.id);
    setSelectedTemplateId(null);
    const defaultBlock: Block = { id: generateUniqueId('block'), type: 'text', content: '', pageId: newPage.id };
    setBlocks(prev => [...prev, defaultBlock]);
  }, []);

  const deletePage = useCallback((pageId: string) => {
    setPages(currentPages => {
      const idsToDelete: string[] = [pageId];
      const findDescendants = (parentId: string) => {
        currentPages.filter(p => p.parentId === parentId).forEach(child => {
          idsToDelete.push(child.id);
          findDescendants(child.id);
        });
      };
      findDescendants(pageId);
      const remainingPages = currentPages.filter(p => !idsToDelete.includes(p.id));
      setBlocks(prevBlocks => prevBlocks.filter(b => !idsToDelete.includes(b.pageId)));
      if (selectedPageId && idsToDelete.includes(selectedPageId)) {
        setSelectedPageId(remainingPages.length > 0 ? remainingPages[0].id : null);
      }
      return remainingPages;
    });
  }, [selectedPageId]);

  const selectPage = useCallback((pageId: string) => { setSelectedPageId(pageId); setSelectedTemplateId(null); }, []);
  const selectTemplate = useCallback((templateId: string) => { setSelectedTemplateId(templateId); setSelectedPageId(null); }, []);
  const togglePageExpansion = useCallback((pageId: string) => setPages(prev => prev.map(p => p.id === pageId ? { ...p, isExpanded: !p.isExpanded } : p)), []);
  const getPageBlocks = useCallback((pageId: string): Block[] => blocks.filter(b => b.pageId === pageId && !b.parentBlockId), [blocks]);
  const getChildBlocks = useCallback((parentBlockId: string): Block[] => blocks.filter(b => b.parentBlockId === parentBlockId), [blocks]);

  const addBlock = useCallback((pageId: string, afterBlockId?: string, parentBlockId?: string): Block => {
    const newBlock: Block = { id: generateUniqueId('block'), type: 'text', content: '', pageId, ...(parentBlockId && { parentBlockId }) };
    setBlocks(prev => {
      let newBlocks = [...prev];
      if (afterBlockId) {
        const index = newBlocks.findIndex(b => b.id === afterBlockId) + 1;
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      if (parentBlockId) {
        newBlocks = newBlocks.map(b => b.id === parentBlockId ? { ...b, children: [...(b.children || []), newBlock.id] } : b);
      }
      return newBlocks;
    });
    return newBlock;
  }, []);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates } : b)), []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(currentBlocks => {
      const block = currentBlocks.find(b => b.id === blockId);
      if (!block) return currentBlocks;
      let idsToDelete = [blockId];
      if (block.type === 'toggle' && block.children) idsToDelete = [...idsToDelete, ...block.children];
      let nextBlocks = currentBlocks.filter(b => !idsToDelete.includes(b.id));
      if (block.parentBlockId) {
        nextBlocks = nextBlocks.map(p => p.id === block.parentBlockId ? { ...p, children: p.children?.filter(cId => cId !== blockId) } : p);
      }
      return nextBlocks;
    });
  }, []);

  const toggleBlockExpansion = useCallback((blockId: string) => setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, isExpanded: !b.isExpanded } : b)), []);
  const addRoadmapTask = useCallback((task: Omit<RoadmapTask, 'id'>) => setRoadmapTasks(prev => [...prev, { ...task, id: generateUniqueId('task') }]), []);
  const updateRoadmapTask = useCallback((taskId: string, updates: Partial<RoadmapTask>) => setRoadmapTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t)), []);
  const deleteRoadmapTask = useCallback((taskId: string) => setRoadmapTasks(prev => prev.filter(t => t.id !== taskId)), []);
  const addCalendarEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => setCalendarEvents(prev => [...prev, { ...event, id: generateUniqueId('event') }]), []);
  const updateCalendarEvent = useCallback((eventId: string, updates: Partial<CalendarEvent>) => setCalendarEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updates } : e)), []);
  const deleteCalendarEvent = useCallback((eventId: string) => setCalendarEvents(prev => prev.filter(e => e.id !== eventId)), []);

  const value = useMemo(() => ({
    workspace, pages, blocks, templates, selectedPageId, selectedTemplateId, roadmapTasks,
    calendarEvents, notifications, isSidebarCollapsed, updateWorkspaceName, updatePageTitle,
    updatePageIcon, addPage, deletePage, selectPage, selectTemplate, togglePageExpansion,
    toggleSidebar, getPageBlocks, getChildBlocks, addBlock, updateBlock, deleteBlock,
    toggleBlockExpansion, addRoadmapTask, updateRoadmapTask, deleteRoadmapTask,
    addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, addNotification, removeNotification
  }), [
    workspace, pages, blocks, templates, selectedPageId, selectedTemplateId, roadmapTasks,
    calendarEvents, notifications, isSidebarCollapsed, updateWorkspaceName, updatePageTitle,
    updatePageIcon, addPage, deletePage, selectPage, selectTemplate, togglePageExpansion,
    toggleSidebar, getPageBlocks, getChildBlocks, addBlock, updateBlock, deleteBlock,
    toggleBlockExpansion, addRoadmapTask, updateRoadmapTask, deleteRoadmapTask,
    addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, addNotification, removeNotification
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
