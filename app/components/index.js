import React from 'react';
import loadable from '../utils/loadable';
import Loading from './custom-Loading';

// Loading - No need to lazy load this component
export { default as Loading } from './custom-Loading';

// Custom Table components
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './custom-table';

export const Welcome = loadable(() => import('./Welcome'), {
  fallback: <Loading />,
});
