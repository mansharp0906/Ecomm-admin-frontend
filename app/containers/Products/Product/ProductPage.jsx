import { Button } from '@/components/custom-button';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import ProductListPage from './ProductListPage';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';

const ProductPage = () => {
 const [refreshTrigger, setRefreshTrigger] = useState(0);
   const navigate = useNavigate();
 
   const handleAddProduct = () => {
     navigate('/products/products/add');
   };

  return (
    <Container>
       <div className="mb-8">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold text-gray-900">Product Pge</h1>
           </div>
           <Button
             variant="primary"
             onClick={handleAddProduct}
             className="flex items-center space-x-2"
           >
             <MdAdd className="text-xl" />
             <span>Add Category</span>
           </Button>
         </div>
         <Breadcrumb
           items={[
             { label: 'Dashboard', href: '/dashboard' },
             { label: 'Products' },
           ]}
         />
       </div>
 
       <ProductListPage refreshTrigger={refreshTrigger} />
     </Container>
  );
};

export default ProductPage;


