import { Button, Container, Breadcrumb, PageHeader } from '@/components';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import AttributeListPage from './AttributeListPage';

const AttributePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleAddattributes = () => {
    navigate('/products/attributes/add');
  };

  return (
    <Container>
      <PageHeader
        title="Attribute"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Attribute' },
        ]}
        onAddClick={handleAddattributes}
        addButtonLabel="Add Attribute"
      />
      <AttributeListPage refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default AttributePage;
