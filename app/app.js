import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import createReducer from './redux/reducers';
import rootSaga from './redux/rootSaga';
import Layout from './containers/layout';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './containers/Home';
import LoginPage from './containers/Auth/LoginPage';
import RegisterPage from './containers/Auth/RegisterPage';
import ForgotPasswordPage from './containers/Auth/ForgotPasswordPage';
import NotFound from './containers/NotFound';
import CategoryPage from './containers/Products/category/CategoryPage';
import CategoryFormPage from './containers/Products/category/CategoryFormPage';
import CategoryView from './containers/Products/category/CategoryView';
import SubCategory from './containers/Products/sub-category/SubCategory';
import SubCategoryFormPage from './containers/Products/sub-category/SubCategoryFormPage';
import SubCategoryView from './containers/Products/sub-category/SubCategoryView';
import { SubSubCategoryPage } from './containers/Products/sub-sub-category';
import SubSubCategoryFormPage from './containers/Products/sub-sub-category/SubSubCategoryFormPage';
import SubSubCategoryView from './containers/Products/sub-sub-category/SubSubCategoryView';
import Attributes from './containers/Products/attributes/AttributePage';
import ProductInHouse from './containers/Products/Product/ProductInHouse';
import Vendors from './containers/Products/Ventors/VendorsPage';
import BulkImpor from './containers/Products/Bulk/BulkImpor';
import Pos from './containers/Products/Pos';
import Pos_report from './containers/Products/Pos_report';
import AllOrders from './containers/Orders/AllOrders';
import PendingOrders from './containers/Orders/PendingOrders';
import ConfirmOrders from './containers/Orders/ConfirmOrders';
import DeliveredOrders from './containers/Orders/DeliveredOrders';
import CanceledOrders from './containers/Orders/CanceledOrders';
import ReturnOrders from './containers/Orders/ReturnOrders';
import RefundRequestOrders from './containers/Orders/RefundRequestOrders';
import Third_party from './containers/System_setting/Third_party';
import Login_Setting from './containers/System_setting/Login_Setting';
import Email_template from './containers/System_setting/Email_template';
import Customers from './containers/User_management/Customers';
import Deleivery_man from './containers/User_management/Deleivery_man';
import Employess from './containers/User_management/Employess';
import Ventors from './containers/User_management/Ventors';
import Earning_report from './containers/Report_Analysis/Earning_report';
import Orde_report from './containers/Report_Analysis/Orde_report';
import Sales_report from './containers/Report_Analysis/Sales_report';
import Product_report from './containers/Report_Analysis/Product_report';
import Bannners from './containers/Promotion/Bannners';
import Coupons from './containers/Promotion/Coupons';
import Featured from './containers/Promotion/Featured';
import Flash_deals from './containers/Promotion/Flash_deals';
import Business_setup from './containers/Business_Setting/Business_setup';
import Pages_media from './containers/Business_Setting/Pages_media';
import Payment_method from './containers/Business_Setting/Payment_method';
import Seo_setting from './containers/Business_Setting/Seo_setting';
import './styles/toast.css';
import 'react-toastify/dist/ReactToastify.css';
import AttributeformPage from './containers/Products/attributes/AttributeformPage';
import AttributeView from './containers/Products/attributes/AttributeView';
import BrandFormPage from './containers/Products/Brand/BrandFormPage';
import BrandView from './containers/Products/Brand/BrandView';
import ProductFormPage from './containers/Products/Product/ProductFormPage';
import BrandPage from './containers/Products/Brand/BrandPage';
// import './styles/toast.css';

const sagaMiddleware = createSagaMiddleware();
const reducer = createReducer();
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
});

sagaMiddleware.run(rootSaga);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Auth pages without Layout */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected pages with Layout */}
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              {/* products */}
              <Route path="products/categories" element={<CategoryPage />} />
              <Route
                path="products/categories/add"
                element={<CategoryFormPage />}
              />
              <Route
                path="products/categories/edit/:id"
                element={<CategoryFormPage />}
              />
              <Route
                path="products/categories/view/:id"
                element={<CategoryView />}
              />
              <Route path="/pos" element={<Pos />} />
              <Route path="/pos/report" element={<Pos_report />} />
              <Route path="/products/subcategories" element={<SubCategory />} />
              <Route
                path="/products/subcategories/add"
                element={<SubCategoryFormPage />}
              />
              <Route
                path="/products/subcategories/edit/:id"
                element={<SubCategoryFormPage />}
              />
              <Route
                path="/products/subcategories/view/:id"
                element={<SubCategoryView />}
              />
              <Route
                path="/products/subsubcategories"
                element={<SubSubCategoryPage />}
              />
              <Route
                path="/products/subsubcategories/add"
                element={<SubSubCategoryFormPage />}
              />
              <Route
                path="/products/subsubcategories/edit/:id"
                element={<SubSubCategoryFormPage />}
              />
              <Route
                path="/products/subsubcategories/view/:id"
                element={<SubSubCategoryView />}
              />
              <Route path="/products/brands" element={<BrandPage />} />
              <Route path="products/brands/add" element={<BrandFormPage />} />
              <Route
                path="products/brands/edit/:id"
                element={<BrandFormPage />}
              />
              <Route path="/products/brands/view/:id" element={<BrandView />} />
              <Route path="/products/attributes" element={<Attributes />} />
              <Route
                path="products/attributes/add"
                element={<AttributeformPage />}
              />
              <Route
                path="/products/attributes/edit/:id"
                element={<AttributeformPage />}
              />
              <Route
                path="/products/attributes/view/:id"
                element={<AttributeView />}
              />
              <Route path="/products/products" element={<ProductInHouse />} />
              <Route
                path="products/products/add"
                element={<ProductFormPage />}
              />
              <Route path="/products/vendors" element={<Vendors />} />
              <Route path="/products/import" element={<BulkImpor />} />

              {/* order */}
              <Route path="/orders/all" element={<AllOrders />} />
              <Route path="/orders/pending" element={<PendingOrders />} />
              <Route path="/orders/confirmed" element={<ConfirmOrders />} />
              <Route path="/orders/delivered" element={<DeliveredOrders />} />
              <Route path="/orders/canceled" element={<CanceledOrders />} />
              <Route path="/orders/return" element={<ReturnOrders />} />
              <Route path="/orders/refund" element={<RefundRequestOrders />} />

              {/* User_Mangement */}
              <Route path="/users/customers" element={<Customers />} />
              <Route path="/users/delivery-men" element={<Deleivery_man />} />
              <Route path="/users/employees" element={<Employess />} />
              <Route path="/users/vendors" element={<Ventors />} />

              {/* Promotion */}
              <Route path="/promotions/banners" element={<Bannners />} />
              <Route path="/promotions/coupons" element={<Coupons />} />
              <Route path="/promotions/featured" element={<Featured />} />
              <Route path="/promotions/flash-deals" element={<Flash_deals />} />

              {/* Report Analysis */}
              <Route path="/reports/earnings" element={<Earning_report />} />
              <Route path="/reports/orders" element={<Orde_report />} />
              <Route path="/reports/products" element={<Product_report />} />
              <Route path="/reports/sales" element={<Sales_report />} />
              {/* Business Setting */}
              <Route path="/settings/business" element={<Business_setup />} />
              <Route path="/settings/pages" element={<Pages_media />} />
              <Route path="/settings/payments" element={<Payment_method />} />
              <Route path="/settings/seo" element={<Seo_setting />} />
              {/* System_setting */}
              <Route path="/system/integrations" element={<Third_party />} />
              <Route path="/system/emails" element={<Login_Setting />} />
              <Route path="/system/login" element={<Email_template />} />
              <Route path="category" element={<CategoryFormPage />} />
            </Route>

            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </Provider>
  );
}

export default App;
