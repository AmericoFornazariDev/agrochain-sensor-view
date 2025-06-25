
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/pages/Dashboard';
import { History } from '@/components/pages/History';
import { Alerts } from '@/components/pages/Alerts';
import { Settings } from '@/components/pages/Settings';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <History />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="agrochain-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 p-6">
              {renderPage()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Index;
