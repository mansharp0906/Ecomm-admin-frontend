import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Product' : 'Add Product'}
            </h1>
          </div>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Product', href: '/products/products' },
            { label: isEditMode ? 'Edit product' : 'Add New Product' },
          ]}
        />
      </div>

      <ProductForm
        key={id || 'new'}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        categoryId={id}
        isEditMode={isEditMode}
      />
    </Container>
  );
};
export default ProductFormPage;