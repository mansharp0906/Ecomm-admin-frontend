import React,{useState} from 'react';
import { Button } from '@/components/custom-button';
import { MdAdd } from 'react-icons/md';
import BrandForm from './BrandForm';
import BrandListform from './BrandListPage';

function Brand() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setRefreshTrigger((prev) => prev + 1); // Trigger list refresh
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };
  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
                <p className="text-gray-600 mt-2">Manage your product Brands</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2"
              >
                <MdAdd className="text-xl" />
                <span>Add Brands</span>
              </Button>
            </div>
          </div>
          {/* Category List */}
          <div className="mb-6">
            <BrandListform refreshTrigger={refreshTrigger} />
          </div>

          {/* Add Category Form Modal */}
          {showAddForm && (
            <BrandForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Brand;
