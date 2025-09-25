import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link to={item.href} className="hover:text-gray-700">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}

            {index < items.length - 1 && (
              <MdChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  ).isRequired,
};

export default Breadcrumb;
