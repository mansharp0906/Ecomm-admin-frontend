import React from 'react';
import PropTypes from 'prop-types';

export const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto"  >
    <table className={`min-w-full w-full divide-y divide-gray-200 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

export const TableRow = ({ children, className = '' }) => (
  <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>
);

export const TableHead = ({ children, className = '' }) => (
  <th
    className={`px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);

// Define TableCell component similarly
export const TableCell = ({ children, className = '', title = '' }) => (
  <td
    className={`px-2 py-2 whitespace-nowrap text-sm ${className}`}
    title={title}
  >
    {children}
  </td>
);

// Define prop types for all components

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
};

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableHeader.propTypes = {
  children: PropTypes.node,
};

TableBody.propTypes = {
  children: PropTypes.node,
};

TableRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableHead.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
