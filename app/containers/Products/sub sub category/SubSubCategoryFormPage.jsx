import { Container, Breadcrumb } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubSubCategoryForm from './SubSubCategoryForm';



const SubSubCategoryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const handleFormSuccess = () => {
    // Navigate back to sub sub categories list after successful creation/update
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
            {
              label: isEditMode
                ? 'Edit Sub Sub Category'
                : 'Add Sub Sub Category',
            },
          ]}
        />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Sub Sub Category' : 'Add Sub Sub Category'}
            </h1>
          </div>
        </div>
      </div>

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
