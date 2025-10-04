import { Container, PageHeader } from '@/components';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductListPage from '../product/ProductListPage';

const ProductInHouse = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/products/products/add');
  };

  return (
    <Container>
      <PageHeader
        title="Product"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products' },
        ]}
        onAddClick={handleAddProduct}
        addButtonLabel="Add Product"
        variant="outline"
      />
      <ProductListPage refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default ProductInHouse;
