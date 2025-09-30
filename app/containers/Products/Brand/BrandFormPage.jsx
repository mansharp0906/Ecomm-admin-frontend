import { Container, Breadcrumb } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BrandForm from './BrandForm';

const BrandFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const handleFormSuccess = () => {
    // Navigate back to categories list after successful creation/update
    navigate('/products/brands');
  };

  const handleFormCancel = () => {
    // Navigate back to categories list when cancelled
    navigate('/products/brands');
  };

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Brands' : 'Add Brands'}
            </h1>
          </div>
        </div>
        <Breadcrumb
          items={[
            // { label: 'Dashboard', href: '/dashboard' },
            { label: 'Brands', href: '/products/brands' },
            { label: isEditMode ? 'Edit Brand' : 'Add New Brand' },
          ]}
        />
      </div>

      <BrandForm
        key={id || 'new'}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        bandId={id}
        isEditMode={isEditMode}
      />
    </Container>
  );
};

export default BrandFormPage;
