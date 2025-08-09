import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Plus, Trash2, ChevronsLeft, ChevronsRight, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';

const sidebarVariants = {
  expanded: { width: '288px', transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  collapsed: { width: '80px', transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const Sidebar: React.FC = () => {
  const {
    pages,
    templates,
    selectedPageId,
    selectedTemplateId,
    isSidebarCollapsed,
    updatePageTitle,
    addPage,
    deletePage,
    selectPage,
    selectTemplate,
    togglePageExpansion,
    toggleSidebar,
  } = useApp();

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageTitle, setEditingPageTitle] = useState('');

  const handlePageTitleEdit = (page: Page) => {
    if (!isSidebarCollapsed) {
      setEditingPageId(page.id);
      setEditingPageTitle(page.title);
    }
  };

  const handlePageTitleSubmit = () => {
    if (editingPageId && editingPageTitle.trim()) {
      updatePageTitle(editingPageId, editingPageTitle.trim());
    }
    setEditingPageId(null);
    setEditingPageTitle('');
  };

  const handlePageTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePageTitleSubmit();
    else if (e.key === 'Escape') {
      setEditingPageId(null);
      setEditingPageTitle('');
    }
  };

  const handleDeletePage = (page: Page) => {
    if (window.confirm(`Are you sure you want to delete "${page.title}" and all its sub-pages?`)) {
      deletePage(page.id);
    }
  };

  const getChildPages = (parentId: string | null): Page[] => pages.filter(page => page.parentId === parentId);
  const hasChildren = (pageId: string): boolean => pages.some(page => page.parentId === pageId);

  const renderPage = (page: Page, level: number = 0) => {
    const isSelected = selectedPageId === page.id;
    const isExpanded = page.isExpanded ?? false;
    const isEditing = editingPageId === page.id;

    return (
      <motion.div key={page.id} layout="position" className="select-none">
        <div
          className={`flex items-center h-12 px-3 my-1 rounded-lg cursor-pointer group transition-all duration-200 relative
            ${ isSelected ? 'bg-quantum-dark-secondary border border-quantum-purple-deep rounded-2xl' : 'hover:bg-quantum-dark-secondary/50' }`}
          style={{ paddingLeft: isSidebarCollapsed ? '24px' : `${level * 20 + 12}px` }}
          onClick={() => !isEditing && selectPage(page.id)}
          title={isSidebarCollapsed ? page.title : ''}
        >
          <div className="flex items-center flex-1 min-w-0">
            {!isSidebarCollapsed && hasChildren(page.id) && !isSelected && (
              <button
                className="p-0.5 rounded hover:bg-white/10 mr-1 flex-shrink-0"
                onClick={(e) => { e.stopPropagation(); togglePageExpansion(page.id); }}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            
            <span className="mr-3 text-xl flex-shrink-0">{page.icon || '📄'}</span>

            {!isSidebarCollapsed && (
              <>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingPageTitle}
                    onChange={(e) => setEditingPageTitle(e.target.value)}
                    onBlur={handlePageTitleSubmit}
                    onKeyDown={handlePageTitleKeyPress}
                    className="flex-1 px-1 py-0.5 text-sm bg-quantum-dark-secondary border border-quantum-purple rounded focus:outline-none focus:ring-1 focus:ring-quantum-purple text-white"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className={`truncate text-base font-medium ${isSelected ? 'text-quantum-gray-light' : 'text-quantum-gray-medium group-hover:text-white'}`}
                    onDoubleClick={(e) => { e.stopPropagation(); handlePageTitleEdit(page); }}
                  >
                    {page.title}
                  </span>
                )}
              </>
            )}
          </div>
          
          {!isSidebarCollapsed && !isEditing && (
            <div className="flex items-center ml-auto pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isSelected && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); addPage(page.id); }} title="Add sub-page" className="p-1 rounded hover:bg-white/10"><Plus size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeletePage(page); }} title="Delete page" className="p-1 rounded hover:bg-white/10 text-quantum-gray-medium hover:text-red-500"><Trash2 size={14} /></button>
                </>
              )}
              {isSelected && hasChildren(page.id) && (
                <button
                  className="p-0.5 rounded hover:bg-white/10"
                  onClick={(e) => { e.stopPropagation(); togglePageExpansion(page.id); }}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {!isSidebarCollapsed && hasChildren(page.id) && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-2"
            >
              {getChildPages(page.id).map(child => renderPage(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.nav
      variants={sidebarVariants}
      animate={isSidebarCollapsed ? 'collapsed' : 'expanded'}
      className="bg-quantum-dark text-white h-full fixed left-0 top-0 flex flex-col p-4 z-20"
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-quantum-dark-secondary border border-quantum-purple-deep rounded-full flex items-center justify-center text-quantum-purple hover:bg-quantum-purple hover:text-quantum-dark transition-all z-10"
        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
      </button>

      {/* Workspace Header */}
      <motion.div layout="position" className={`flex items-center gap-4 mb-8 ${isSidebarCollapsed ? 'justify-center' : 'p-3'}`}>
        <div className="w-16 h-16 bg-white rounded-full flex-shrink-0"></div>
        {!isSidebarCollapsed && <span className="text-4xl font-bold text-quantum-gray-light">Quantum</span>}
      </motion.div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 -mr-2">
        {/* Templates */}
        <motion.div layout="position" variants={navItemVariants} className={`space-y-2 ${isSidebarCollapsed ? 'px-0' : 'px-3'}`}>
          {!isSidebarCollapsed && <h3 className="text-quantum-gray-dark font-semibold mb-2 text-lg">Templates</h3>}
          {templates.map(template => (
            <div
              key={template.id}
              className={`flex items-center h-10 cursor-pointer group transition-all duration-200 text-quantum-gray-medium hover:text-white
              ${selectedTemplateId === template.id ? 'text-white' : ''}
              ${isSidebarCollapsed ? 'justify-center' : ''}`}
              onClick={() => selectTemplate(template.id)}
              title={template.name}
            >
              <span className={`text-xl flex-shrink-0 ${isSidebarCollapsed ? '' : 'mr-3'}`}>{template.icon}</span>
              {!isSidebarCollapsed && <span className="text-lg font-medium">{template.name}</span>}
            </div>
          ))}
        </motion.div>

        {/* Pages */}
        <motion.div layout="position" variants={navItemVariants} className="mt-8">
          {!isSidebarCollapsed && <h3 className="text-quantum-gray-dark font-semibold mb-2 text-lg px-3">Pages</h3>}
          {getChildPages(null).map(page => renderPage(page))}
        </motion.div>
      </div>

      {/* Add Page Button */}
      <motion.div layout="position" className="pt-4 mt-auto">
        <button
          onClick={() => addPage()}
          className={`w-full h-12 flex items-center justify-center px-3 text-lg font-medium rounded-xl transition-all duration-300
          bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/50`}
          title="Add Page"
        >
          {!isSidebarCollapsed && <span className="font-semibold">Add Page</span>}
          <Plus size={22} className={isSidebarCollapsed ? '' : 'ml-2'} />
        </button>
      </motion.div>
    </motion.nav>
  );
};

export default Sidebar;
