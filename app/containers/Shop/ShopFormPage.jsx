import { Container, PageHeader } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShopForm from './ShopForm';

const ShopFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const handleFormSuccess = () => {
    navigate('/products/subsubcategories');
  };

  const handleFormCancel = () => {
    navigate('/products/subsubcategories');
  };

  return (
    <Container>
      <PageHeader
        title={isEditMode ? 'Edit Shop' : 'Add Shop'}
        breadcrumbItems={[
          // { label: 'Dashboard', href: '/dashboard' },
          { label: 'Shop', href: '/shops' },
          {
            label: isEditMode
              ? 'Edit Shop'
              : 'Add Shop',
          },
        ]}
      />

      <ShopForm
        key={id || 'new'}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        shopId={id}
        isEditMode={isEditMode}
      />
    </Container>
  );
};

export default ShopFormPage;
