import { Button, Container, Breadcrumb } from '@/components';
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attributes</h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddattributes}
            className="flex items-center space-x-2"
          >
            <MdAdd className="text-xl" />
            <span>Add Attribute</span>
          </Button>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Attribute' },
          ]}
        />
      </div>

      <AttributeListPage refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default AttributePage;
