import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubCategoryForm from './SubCategoryForm';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';

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
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sub Categories', href: '/products/subcategories' },
            { label: isEditMode ? 'Edit Sub Category' : 'Add Sub Category' },
          ]}
        />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}
            </h1>
          </div>
        </div>
      </div>

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
