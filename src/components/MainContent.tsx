import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BlockEditor from './BlockEditor';
import RoadmapTemplate from './templates/RoadmapTemplate';
import CalendarTemplate from './templates/CalendarTemplate';
import IconPicker from './IconPicker';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { SmilePlus } from 'lucide-react';
import AIPromptBar from './AIPromptBar';
import { generateContentStream, isAIConfigured } from '../services/ai';

const MainContent: React.FC = () => {
  const { pages, templates, selectedPageId, selectedTemplateId, updatePageIcon, isSidebarCollapsed, addBlock, updateBlock } = useApp();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  useOnClickOutside(iconPickerRef, () => setIsIconPickerOpen(false), iconButtonRef);

  const mainContentVariants = {
    expanded: { marginLeft: '288px' },
    collapsed: { marginLeft: '80px' },
  };

  const handleSendPrompt = async (prompt: string) => {
    if (!selectedPageId || isAILoading) return;

    setIsAILoading(true);
    
    const aiBlock = addBlock(selectedPageId, undefined, undefined, '<strong>Thinking...</strong>');
    
    try {
      const stream = await generateContentStream(prompt);
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        const boldedResponse = `<strong>${fullResponse.replace(/\n/g, '<br>')}</strong>`;
        updateBlock(aiBlock.id, { content: boldedResponse });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      let displayMessage = 'Sorry, an unexpected error occurred.';
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('quota')) {
          displayMessage = 'You have exceeded your daily free request limit for the AI. Please check your Google AI plan or try again tomorrow.';
        } else if (errorMessage.includes('api key')) {
          displayMessage = 'There seems to be an issue with your Gemini API key. Please verify it in the <code>.env</code> file and refresh the page.';
        } else {
          displayMessage = `An unexpected error occurred. Please try again later.`;
        }
      }
      updateBlock(aiBlock.id, { content: `<strong><span class="text-red-500">${displayMessage}</span></strong>` });
    } finally {
      setIsAILoading(false);
    }
  };

  const renderContent = () => {
    if (selectedTemplateId) {
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
      if (selectedTemplate?.type === 'roadmap') return <RoadmapTemplate />;
      if (selectedTemplate?.type === 'calendar') return <CalendarTemplate />;
    }

    const selectedPage = pages.find(page => page.id === selectedPageId);
    if (selectedPage) {
      const handleIconSelect = (icon: string) => {
        updatePageIcon(selectedPage.id, icon);
        setIsIconPickerOpen(false);
      };

      return (
        <div className="bg-white h-full overflow-y-auto rounded-l-2xl pb-32">
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

          <div className="px-4 py-6 max-w-4xl mx-auto">
            <BlockEditor key={selectedPage.id} pageId={selectedPage.id} />
          </div>
        </div>
      );
    }

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
      <div className="relative h-full">
        {renderContent()}
        {selectedPageId && (
            <div className="absolute bottom-0 left-0 right-0 z-30 p-4 flex justify-center items-center bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    {isAIConfigured() ? (
                        <AIPromptBar isLoading={isAILoading} onSendPrompt={handleSendPrompt} />
                    ) : (
                        <div className="h-12 px-6 flex items-center bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold shadow-lg border border-yellow-200">
                            Please set VITE_GEMINI_API_KEY in the .env file to enable AI.
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </motion.main>
  );
};

export default MainContent;
