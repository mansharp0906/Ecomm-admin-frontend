import { Button } from '@/components/custom-button';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';
import BrandListPage from './BrandListPage';

const BrandPage = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddBrand}
            className="flex items-center space-x-2"
          >
            <MdAdd className="text-xl" />
            <span>Add Brands</span>
          </Button>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Brands' },
          ]}
        />
      </div>

      <BrandListPage refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default BrandPage;
