import { Button } from '@/components';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const ProductInHouse = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setRefreshTrigger((prev) => prev + 1); 
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product</h1>
              <p className="text-gray-600 mt-2">
                Manage your product Product
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2"
            >
              <MdAdd className="text-xl" />
              <span>Add Products</span>
            </Button>
          </div>
        </div>

   
        <div className="mb-6">
          <ProductList refreshTrigger={refreshTrigger} />
        </div>

 
        {showAddForm && (
          <ProductForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ProductInHouse;


