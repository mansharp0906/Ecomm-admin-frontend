import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { ThemeProvider } from './contexts/ThemeContext';

// ===== MAIN APP RENDERING =====
const MOUNT_NODE = document.getElementById('app');
const root = ReactDOM.createRoot(MOUNT_NODE);

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);

// ===== CENTRALIZED EXPORTS =====

// Contexts
export { LocaleContext, ThemeProvider, useTheme } from './contexts';

// Components
export {
  Button,
  FileUploadButton,
  FormProvider,
  SelectField,
  TextAreaField,
  CustomIcon,
  InputTextField,
  DeleteConfirmationModal,
  Breadcrumb,
  Container,
  DataNotFound,
  LoadingData,
  TableContainer,
  Pagination,
  SearchBar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Loading,
  Welcome,
} from './components';

// Validations
export {
  useValidation,
  attributeCreateSchema,
  attributeUpdateSchema,
  attributeValueSchema,
  brandCreateSchema,
  brandUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
  userCreateSchema,
  userUpdateSchema,
  loginSchema,
  passwordResetSchema,
  changePasswordSchema,
} from './validations';
