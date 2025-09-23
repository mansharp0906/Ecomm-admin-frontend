import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubCategoryForm from './SubCategoryForm';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';

const SubCategoryFormPage = () => {
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    // Navigate back to sub categories list after successful creation
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
            { label: 'Add Sub Category' },
          ]}
        />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add Sub Category
            </h1>
          </div>
        </div>
      </div>

      <SubCategoryForm
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    </Container>
  );
};

export default SubCategoryFormPage;
