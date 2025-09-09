import { useState } from 'react';
import Navigation, { type NavigationTab } from './Navigation';
import { LeadsPage } from '../../../features/leads/components';
import { OpportunitiesPage } from '../../../features/opportunities/components';

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('leads');

  const renderContent = () => {
    switch (activeTab) {
      case 'leads':
        return <LeadsPage />;
      case 'opportunities':
        return <OpportunitiesPage />;
      default:
        return <LeadsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Mini Seller Console
            </h1>
          </div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:px-0">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AppLayout;
