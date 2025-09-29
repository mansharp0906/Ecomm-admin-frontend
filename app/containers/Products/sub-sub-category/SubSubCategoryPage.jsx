import { Container, PageHeader } from '@/components';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubSubCategoryList from './SubSubCategoryList';

const SubSubCategoryPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleAddSubSubCategory = () => {
    navigate('/products/subsubcategories/add');
  };

  return (
    <Container>
      <PageHeader
        title="Sub Sub Category"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Sub Sub Category' },
        ]}
        onAddClick={handleAddSubSubCategory}
        addButtonLabel="Sub Sub Category"
      />
      <SubSubCategoryList refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default SubSubCategoryPage;
