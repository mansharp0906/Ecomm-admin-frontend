import { Button } from '@/components/custom-button';
import InputTextField from '@/components/input-field/InputTextField';
import SelectField from '@/components/select/SelectField';
import TextAreaField from '@/components/textarea-field/TextAreaField';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';

const CategoryPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    priority: '',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);

    // Reset form
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      priority: '',
      status: 'active',
    });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-2">
                Manage your product categories
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2"
            >
              <MdAdd className="text-xl" />
              <span>Add Category</span>
            </Button>
          </div>
        </div>

        {/* Add Category Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Add New Category</h2>
              </div>

              {/* Form Fields - Scrollable */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 overflow-y-auto flex-1"
                style={{ minHeight: '200px' }}
              >
                <InputTextField
                  label="Category Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  error={formErrors?.name}
                />

                <InputTextField
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Enter slug"
                  error={formErrors?.slug}
                />

                <TextAreaField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  rows={3}
                  error={formErrors?.description}
                />

                <InputTextField
                  label="Image URL"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  error={formErrors?.image}
                />

                <InputTextField
                  label="Meta Title"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="Enter meta title"
                  error={formErrors?.metaTitle}
                />

                <TextAreaField
                  label="Meta Description"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="Enter meta description"
                  rows={3}
                  error={formErrors?.metaDescription}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputTextField
                    label="Priority"
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    placeholder="e.g. 1"
                    error={formErrors?.priority}
                  />

                  <SelectField
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                    error={formErrors?.status}
                  />
                </div>
              </form>

              {/* Buttons - Fixed at bottom */}
              <div className="p-6 border-t flex space-x-3">
                <Button type="submit" variant="primary" className="flex-1">
                  Add
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      name: '',
                      slug: '',
                      description: '',
                      image: '',
                      priority: '',
                      status: 'active',
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
