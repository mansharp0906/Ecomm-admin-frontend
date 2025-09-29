import React from 'react';
import PropTypes from 'prop-types';
import { InputTextField, Button } from '@/components';

const Form = ({ title, fields, formData, onChange, onSubmit }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg border">
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            {title}
          </h2>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field) => (
            <InputTextField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={onChange}
              error={field.error}
            />
          ))}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

Form.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      placeholder: PropTypes.string,
      error: PropTypes.string,
    }),
  ).isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form;
