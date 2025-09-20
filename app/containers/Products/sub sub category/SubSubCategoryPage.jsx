import React, { useState } from 'react';
import { Button } from '@/components/custom-button';
import SubSubCategoryForm from './SubSubCategoryForm';
import SubSubCategoryList from './SubSubCategoryList';

const SubSubCategoryPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSubSubCategory = () => {
    setShowForm(true);
  };

  const handleFormSuccess = (data) => {
    console.log('Sub Sub Category created:', data);
    setShowForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sub Sub Categories
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your product sub sub categories (Level 2)
            </p>
          </div>
          <Button
            onClick={handleAddSubSubCategory}
            variant="primary"
            className="px-4 py-2"
          >
            + Add Sub Sub Category
          </Button>
        </div>
      </div>

      {/* Sub Sub Category List */}
      <SubSubCategoryList refreshTrigger={refreshTrigger} />

      {/* Sub Sub Category Form Modal */}
      {showForm && (
        <SubSubCategoryForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default SubSubCategoryPage;
