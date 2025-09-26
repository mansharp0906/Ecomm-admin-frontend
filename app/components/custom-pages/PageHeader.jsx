import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Button } from '@/components';
import { MdAdd } from 'react-icons/md';

const PageHeader = ({
  title,
  breadcrumbItems,
  onAddClick,
  addButtonLabel = 'Add',
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
        {onAddClick && (
          <Button
            variant="primary"
            onClick={onAddClick}
            className="flex items-center space-x-2"
          >
            <MdAdd className="text-xl" />
            <span>{addButtonLabel}</span>
          </Button>
        )}
      </div>
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbItems: PropTypes.array,
  onAddClick: PropTypes.func,
  addButtonLabel: PropTypes.string,
};

export default PageHeader;
