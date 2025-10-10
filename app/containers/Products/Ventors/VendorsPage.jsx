import { Button, Container, Breadcrumb } from '@/components';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import BrandListPage from '../Brand/BrandListPage';

const VendorsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleAddBrand = () => {
    navigate('/products/brands/add');
  };
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ventors</h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddBrand}
            className="flex items-center space-x-2"
          >
            <MdAdd className="text-xl" />
            <span>Add Ventors</span>
          </Button>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Ventors' },
          ]}
        />
      </div>
      <BrandListPage refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default VendorsPage;
