import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';
import AttributeForm from './AttributeForm';

const AttributeformPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const handleFormSuccess = () => {
    // Navigate back to Attribute list after successful creation/update
    navigate('/products/attributes');
  };
   const handleFormCancel = () => {
    // Navigate back to categories list when cancelled
    navigate('/products/attributes');
  };
  return (
      <Container>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Attributes' : 'Add Attributes'}
                </h1>
              </div>
            </div>
            <Breadcrumb
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Attributes', href: '/products/attributes' },
                { label: isEditMode ? 'Edit Attributes' : 'Add New Attributes' },
              ]}
            />
          </div>
    
          <AttributeForm
            key={id || 'new'}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            categoryId={id}
            isEditMode={isEditMode}
          />
        </Container>
  )
};

export default AttributeformPage;
