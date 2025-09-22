import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubSubCategoryForm from './SubSubCategoryForm';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';

const SubSubCategoryFormPage = () => {
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    // Navigate back to sub sub categories list after successful creation
    navigate('/products/subsubcategories');
  };

  const handleFormCancel = () => {
    // Navigate back to sub sub categories list when cancelled
    navigate('/products/subsubcategories');
  };

  return (
    <Container>
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sub Sub Categories', href: '/products/subsubcategories' },
            { label: 'Add New Sub Sub Category' },
          ]}
        />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Sub Sub Category
            </h1>
            <p className="text-gray-600 mt-2">Create a new sub sub category</p>
          </div>
        </div>
      </div>

      <SubSubCategoryForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
    </Container>
  );
};

export default SubSubCategoryFormPage;
