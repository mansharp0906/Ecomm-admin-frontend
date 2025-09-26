import { Button, Container, Breadcrumb } from '@/components';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import CategoryListPage from './CategoryListPage';



const CategoryPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleAddCategory = () => {
    navigate('/products/categories/add');
  };

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Category</h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddCategory}
            className="flex items-center space-x-2"
          >
            <MdAdd className="text-xl" />
            <span>Add Category</span>
          </Button>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Categories' },
          ]}
        />
      </div>

      <CategoryListPage refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default CategoryPage;
