import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Button } from '@/components';

const PageHeaderWithActions = ({ title, breadcrumbItems, actions }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
        {actions?.length > 0 && (
          <div className="flex space-x-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                onClick={action.onClick}
                className="flex items-center space-x-2"
              >
                {action.icon && <action.icon.type {...action.icon.props} />}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
    </div>
  );
};

PageHeaderWithActions.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbItems: PropTypes.array,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.string,
      icon: PropTypes.element,
    }),
  ),
};

export default PageHeaderWithActions;
