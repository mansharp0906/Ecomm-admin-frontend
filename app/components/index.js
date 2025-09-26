import React from 'react';
import loadable from '../utils/loadable';

// Custom Button component
export { default as Button } from './custom-button/Button';

// Custom File Upload component
export { default as FileUploadButton } from './custom-fileuplode/FileUploadButton';

// Custom Form components
export { default as FormProvider } from './custom-forms/FormProvider';
export { default as SelectField } from './custom-forms/SelectField';
export { default as TextAreaField } from './custom-forms/TextAreaField';

// Custom Icon components
export { default as CustomIcon } from './custom-icon/CustomIcon';
export {
  DashboardIcon,
  ProductIcon,
  OrderIcon,
  UserManagementIcon,
  SystemSettingsIcon,
  BusinessSettingsIcon,
  PromotionIcon,
  ReportsIcon,
  ProductManagementIcon,
} from './custom-icon/SidebarIcons';

// Custom Input Field component
export { default as InputTextField } from './custom-input-field/InputTextField';

// Custom Modal components
export { default as DeleteConfirmationModal } from './custom-modal/DeleteConfirmationModal';

// Custom Page components
export { default as Breadcrumb } from './custom-pages/Breadcrumb';
export { default as Container } from './custom-pages/Container';
export { default as DataNotFound } from './custom-pages/DataNotFound';
export { default as LoadingData } from './custom-pages/LoadingData';
export { default as TableContainer } from './custom-pages/TableContainer';
export { default as PageHeader } from './custom-pages/PageHeader';
export { default as PageHeaderWithActions } from './custom-pages/PageHeaderWithActions';

// Custom Pagination component
export { default as Pagination } from './custom-pagination/Pagination';

// Custom Search component
export { default as SearchBar } from './custom-search/SearchBar';
export { default as SearchBarContainer } from './custom-search/SearchBarContainer';

// Custom Table components
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './custom-table/table';

// Loading component
export { default as Loading } from './Loading';

// Welcome component (lazy loaded)
export const Welcome = loadable(() => import('./Welcome'), {
  fallback: <div>Loading...</div>,
});
