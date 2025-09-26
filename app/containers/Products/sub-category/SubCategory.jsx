import { Button, Container, Breadcrumb, PageHeader } from '@/components';
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
      <PageHeader
        title="Sub Category"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Sub Categories' },
        ]}
        onAddClick={handleAddSubCategory}
        addButtonLabel="Add Sub Category"
      />
      <SubCategoryList refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default SubCategory;
