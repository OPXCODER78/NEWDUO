import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NotificationContainer from './components/NotificationContainer';

const AppContent: React.FC = () => {
  const { addNotification } = useApp();

  useEffect(() => {
    // Using a different key to ensure notification shows for this update
    const hasNotified = sessionStorage.getItem('notified-sidebar-v2');
    if (!hasNotified) {
      const timer = setTimeout(() => {
        addNotification({
          title: 'Sidebar Revamped!',
          message: 'The sidebar now matches the new design with fluid animations.',
          iconUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/4cc0/aaec/e55203c8013f53c341db0c2d8fb95c18?Expires=1755475200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZvsOtjGbUF6-D3U2Es19657A1turcKmfhIi0xrHgLel3TF4EzxK8BTc-CtHENjrSIHSFJAJy8Jk9Am5lLlS2oE9siEeBgG0w4tT2EMnCmbdKDQyM1Z-eSw~yiO8zvu-70sXzS8DaGu9b3XE0TtNkDD8oES-9w1M2qgXn4rbgLDcCeVvlvZcj6yX0V9lOVTtWQMaJrPzaOGjRKbJuutWaTikNSfV2PmaFHisKwbGwzDuywVgdx8QyNxSCvoPhYj9EHJs10QGnfvXdv1oJtuokgbzfARN1t1sp8i6FKedJd--ZN52nlViMazQ43WoRdpL15~IwHImeaz~HNUcwU5Ajtw__',
        });
        sessionStorage.setItem('notified-sidebar-v2', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [addNotification]);

  return (
    <div className="h-screen w-screen bg-quantum-dark-secondary overflow-hidden">
      <Sidebar />
      <MainContent />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <NotificationContainer />
      <AppContent />
    </AppProvider>
  );
};

export default App;
