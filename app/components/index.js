import React from 'react';
import loadable from '../utils/loadable';

// Custom Table components
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './custom-table';

// Custom Pagination component
export { Pagination } from './custom-pagination';

export const Welcome = loadable(() => import('./Welcome'), {
  fallback: <div>Loading...</div>,
});
