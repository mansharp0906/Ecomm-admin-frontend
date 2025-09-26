import { Button, Container, Breadcrumb } from '@/components';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import SubCategoryList from './SubCategoryList';



const SubCategory = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleAddSubCategory = () => {
    navigate('/products/subcategories/add');
  };

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sub Category</h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddSubCategory}
            className="flex items-center space-x-2"
          >
            <MdAdd className="text-xl" />
            <span>Add Sub Category</span>
          </Button>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sub Category' },
          ]}
        />
      </div>

      <SubCategoryList refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default SubCategory;
