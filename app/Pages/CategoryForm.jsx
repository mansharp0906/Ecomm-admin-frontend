import React, { useState } from 'react';
import InputTextField from '@/components/custom-form-field/InputTextField';
import Button from '@/components/custom-button/Button';

export default function CategoryForm({ sidebarOpen }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    priority: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    // Main content ko sidebarOpen prop ke hisab se translate aur overlay effect de rahe hain
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8 relative z-10 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-64 md:translate-x-0' : 'translate-x-0'
      }`}
    >
      <div className="w-full max-w-lg p-6 sm:p-8 bg-white rounded-xl shadow-lg border">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Category Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputTextField
              label="Category Name"
              name="name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
            />

            <InputTextField
              label="Slug"
              name="slug"
              type="text"
              placeholder="Enter slug"
              value={formData.slug}
              onChange={handleChange}
            />

            <InputTextField
              label="Description"
              name="description"
              type="text"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />

            <InputTextField
              label="Image"
              name="image"
              type="text"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={handleChange}
            />

            <InputTextField
              label="Priority"
              name="priority"
              type="number"
              placeholder="Enter priority"
              value={formData.priority}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
