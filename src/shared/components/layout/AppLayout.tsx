import { useState } from 'react';

import { LeadsPage } from '@/features/leads/components';
import { OpportunitiesPage } from '@/features/opportunities/components';

import Breadcrumb from './Breadcrumb';
import Header from './Header';
import Navigation, { type NavigationTab } from './Navigation';

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('leads');

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Dashboard', href: '/' },
      {
        label: activeTab === 'leads' ? 'Leads' : 'Opportunities',
        current: true,
      },
    ];
    return items;
  };

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
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumb items={getBreadcrumbItems()} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:px-0">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AppLayout;
