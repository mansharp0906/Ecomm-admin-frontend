import { Container, PageHeader } from '@/components';
import React, { useState } from 'react';
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
      <PageHeader
        title="Category"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Categories' },
        ]}
        onAddClick={handleAddCategory}
        addButtonLabel="Add Category"
        variant="outline"
      />
      <CategoryListPage refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default CategoryPage;
