import { Container, Breadcrumb } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryForm from './CategoryForm';



const CategoryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const handleFormSuccess = () => {
    // Navigate back to categories list after successful creation/update
    navigate('/products/categories');
  };

  const handleFormCancel = () => {
    // Navigate back to categories list when cancelled
    navigate('/products/categories');
  };

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Category' : 'Add Category'}
            </h1>
          </div>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Categories', href: '/products/categories' },
            { label: isEditMode ? 'Edit Category' : 'Add New Category' },
          ]}
        />
      </div>

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
