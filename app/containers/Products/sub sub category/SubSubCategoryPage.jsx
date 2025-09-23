import React, { useState } from 'react';
import { Button } from '@/components/custom-button';
import { useNavigate } from 'react-router-dom';
import SubSubCategoryList from './SubSubCategoryList';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';

const SubSubCategoryPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleAddSubSubCategory = () => {
    navigate('/products/subsubcategories/add');
  };

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sub Sub Category
            </h1>
          </div>
          <Button
            onClick={handleAddSubSubCategory}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Sub Sub Category</span>
          </Button>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sub Sub Category' },
          ]}
        />
      </div>

      <SubSubCategoryList refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default SubSubCategoryPage;
