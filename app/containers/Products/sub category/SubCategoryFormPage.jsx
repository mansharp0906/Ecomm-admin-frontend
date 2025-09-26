import { Container, Breadcrumb, PageHeader } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubCategoryForm from './SubCategoryForm';

const SubCategoryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const handleFormSuccess = () => {
    // Navigate back to sub categories list after successful creation/update
    navigate('/products/subcategories');
  };

  const handleFormCancel = () => {
    // Navigate back to sub categories list when cancelled
    navigate('/products/subcategories');
  };

  return (
    <Container>
      <PageHeader
        title={isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Sub Categories', href: '/products/subcategories' },
          { label: isEditMode ? 'Edit Sub Category' : 'Add Sub Category' },
        ]}
      />
      <SubCategoryForm
        key={id || 'new'}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        categoryId={id}
        isEditMode={isEditMode}
      />
    </Container>
  );
};

export default SubCategoryFormPage;
