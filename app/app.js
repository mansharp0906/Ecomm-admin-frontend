import './i18n';
import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import createReducer from './redux/reducers';
import rootSaga from './redux/rootSaga';
// import { NotFound } from './containers/pageListAsync';
import Layout from './containers/layout';
import Dashboard from './containers/Home';
import LoginPage from './containers/Auth/LoginPage';
import RegisterPage from './containers/Auth/RegisterPage';
import ForgotPasswordPage from './containers/Auth/ForgotPasswordPage';
import NotFound from './containers/NotFound';
import CategoryForm from './Pages/CategoryForm';
import CategoryPage from './containers/Products/CategoryPage';
import SubCategory from './containers/Products/SubCategory';
import Brand from './containers/Products/Brand';
import Attributes from './containers/Products/Attributes';
import ProductInHouse from './containers/Products/ProductInHouse';
import Vendors from './containers/Products/Vendors';
import BulkImpor from './containers/Products/BulkImpor';
import Pos from './containers/Products/pos';
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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* products */}
            <Route path="products/categories" element={<CategoryPage />} />
            <Route path="/pos" element={<Pos />} />
            <Route path="/pos/report" element={<Pos_report />} />
            <Route path="/products/subcategories" element={<SubCategory />} />
            <Route path="/products/brands" element={<Brand />} />
            <Route path="/products/attributes" element={<Attributes />} />
            <Route path="/products/inhouse" element={<ProductInHouse />} />
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
            <Route path="category" element={<CategoryForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
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
