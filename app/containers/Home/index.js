import React from 'react';
import { Container } from '@/components';
import DashboadPage from '../Dasboad/DashboadPage';

const Dashboard = () => {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WelcomeAdmin</h1>
          </div>
        </div>
        <DashboadPage />
      </div>
    </Container>
  );
};

export default Dashboard;
