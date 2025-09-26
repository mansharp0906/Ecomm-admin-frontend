import { Container, Breadcrumb, PageHeader } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AttributeForm from './AttributeForm';

const AttributeformPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const handleFormSuccess = () => {
    // Navigate back to Attribute list after successful creation/update
    navigate('/products/attributes');
  };
  const handleFormCancel = () => {
    // Navigate back to categories list when cancelled
    navigate('/products/attributes');
  };
  return (
    <Container>
      <PageHeader
        title={isEditMode ? 'Edit Attribute' : 'Add Attribute'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Categories', href: '/products/categories' },
          { label: isEditMode ? 'Edit Attribute' : 'Add New Attribute' },
        ]}
      />

      <AttributeForm
        key={id || 'new'}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        categoryId={id}
        isEditMode={isEditMode}
      />
    </Container>
  );
};

export default AttributeformPage;
