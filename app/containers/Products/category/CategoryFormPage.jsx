import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from './CategoryForm';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';

const CategoryFormPage = () => {
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    // Navigate back to categories list after successful creation
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
            <h1 className="text-3xl font-bold text-gray-900">Add Category</h1>
          </div>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Category', href: '/products/categories' },
            { label: 'Add New Category' },
          ]}
        />
      </div>

      <CategoryForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
    </Container>
  );
};

export default CategoryFormPage;
