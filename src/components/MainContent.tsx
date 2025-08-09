import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BlockEditor from './BlockEditor';
import RoadmapTemplate from './templates/RoadmapTemplate';
import CalendarTemplate from './templates/CalendarTemplate';
import IconPicker from './IconPicker';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { SmilePlus } from 'lucide-react';

const MainContent: React.FC = () => {
  const { pages, templates, selectedPageId, selectedTemplateId, updatePageIcon, isSidebarCollapsed } = useApp();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  const iconButtonRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside(iconPickerRef, () => setIsIconPickerOpen(false), iconButtonRef);

  const mainContentVariants = {
    expanded: { marginLeft: '288px' },
    collapsed: { marginLeft: '80px' },
  };

  const renderContent = () => {
    // If a template is selected
    if (selectedTemplateId) {
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
      if (selectedTemplate?.type === 'roadmap') return <RoadmapTemplate />;
      if (selectedTemplate?.type === 'calendar') return <CalendarTemplate />;
    }

    // If a page is selected
    const selectedPage = pages.find(page => page.id === selectedPageId);
    if (selectedPage) {
      const handleIconSelect = (icon: string) => {
        updatePageIcon(selectedPage.id, icon);
        setIsIconPickerOpen(false);
      };

      return (
        <div className="bg-white h-full overflow-y-auto rounded-l-2xl">
          {/* Page Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="relative mb-4">
              <button
                ref={iconButtonRef}
                onClick={() => setIsIconPickerOpen(prev => !prev)}
                className="hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                {selectedPage.icon ? (
                  <span className="text-5xl">{selectedPage.icon}</span>
                ) : (
                  <div className="flex items-center text-gray-400 p-2">
                    <SmilePlus size={24} className="mr-2" />
                    <span className="text-sm font-medium">Add Icon</span>
                  </div>
                )}
              </button>
              {isIconPickerOpen && (
                <div ref={iconPickerRef} className="absolute top-full mt-2 z-50">
                  <IconPicker onSelect={handleIconSelect} />
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedPage.title}
            </h1>
            <p className="text-sm text-gray-500">
              Created on {selectedPage.createdAt.toLocaleDateString()}
            </p>
          </div>

          {/* Block Editor */}
          <div className="px-4 py-6 max-w-4xl mx-auto">
            <BlockEditor key={selectedPage.id} pageId={selectedPage.id} />
          </div>
        </div>
      );
    }

    // Default view
    return (
      <div className="flex items-center justify-center bg-white h-full rounded-l-2xl">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No page selected</p>
          <p className="text-sm">Select a page from the sidebar to get started</p>
        </div>
      </div>
    );
  };

  return (
    <motion.main
      className="h-full"
      variants={mainContentVariants}
      animate={isSidebarCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {renderContent()}
    </motion.main>
  );
};

export default MainContent;
