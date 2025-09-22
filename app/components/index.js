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

// Custom Search component
export { SearchBar } from './custom-search';

// Custom Modal components
export { DeleteConfirmationModal } from './custom-modal';

export const Welcome = loadable(() => import('./Welcome'), {
  fallback: <div>Loading...</div>,
});
