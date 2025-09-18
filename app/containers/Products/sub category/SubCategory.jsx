import { Button } from '@/components/custom-button';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import SubCategoryForm from './SubCategoryForm';
import SubCategoryList from './SubCategoryList';

const SubCategory = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = (newSubCategory) => {
    setShowAddForm(false);
    setRefreshTrigger((prev) => prev + 1); // Trigger list refresh
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
              <h1 className="text-3xl font-bold text-gray-900">
                Sub Categories
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your product sub categories
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2"
            >
              <MdAdd className="text-xl" />
              <span>Add Sub Category</span>
            </Button>
          </div>
        </div>

        {/* Sub Category List */}
        <div className="mb-6">
          <SubCategoryList refreshTrigger={refreshTrigger} />
        </div>

        {/* Add Sub Category Form Modal */}
        {showAddForm && (
          <SubCategoryForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
};

export default SubCategory;
