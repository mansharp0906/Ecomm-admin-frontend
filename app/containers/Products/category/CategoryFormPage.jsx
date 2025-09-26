import { Container, Breadcrumb, PageHeader } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryForm from './CategoryForm';

const CategoryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const handleFormSuccess = () => {
    navigate('/products/categories');
  };

  const handleFormCancel = () => {
    navigate('/products/categories');
  };

  return (
    <Container>
      <PageHeader
        title={isEditMode ? 'Edit Category' : 'Add Category'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Categories', href: '/products/categories' },
          { label: isEditMode ? 'Edit Category' : 'Add New Category' },
        ]}
      />

      <CategoryForm
        key={id || 'new'}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        categoryId={id}
        isEditMode={isEditMode}
      />
    </Container>
  );
};

export default CategoryFormPage;
