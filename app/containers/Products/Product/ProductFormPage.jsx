import { Container, Breadcrumb, PageHeader } from '@/components';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const handleFormSuccess = () => {
    // Navigate back to Products list after successful creation/update
    navigate('/products/products');
  };

  const handleFormCancel = () => {
    // Navigate back to Products list when cancelled
    navigate('/products/products');
  };

  return (
    <Container>
      <PageHeader
        title={isEditMode ? 'Edit Product' : 'Add Product'}
        breadcrumbItems={[
          // { label: 'Dashboard', href: '/dashboard' },
          { label: 'Product', href: '/products/products' },
          { label: isEditMode ? 'Edit product' : 'Add New Product' },
        ]}
      />

      <ProductForm
        key={id || 'new'}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        productId={id}
        isEditMode={isEditMode}
      />
    </Container>
  );
};
export default ProductFormPage;
