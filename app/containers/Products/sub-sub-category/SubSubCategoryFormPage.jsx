import { Container, PageHeader } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubSubCategoryForm from './SubSubCategoryForm';

const SubSubCategoryFormPage = () => {
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
        title={isEditMode ? 'Edit Sub Sub Category' : 'Add Sub Sub Category'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Sub Sub Categories', href: '/products/subsubcategories' },
          {
            label: isEditMode
              ? 'Edit Sub Sub Category'
              : 'Add Sub Sub Category',
          },
        ]}
      />

      <SubSubCategoryForm
        key={id || 'new'}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        categoryId={id}
        isEditMode={isEditMode}
      />
    </Container>
  );
};

export default SubSubCategoryFormPage;
