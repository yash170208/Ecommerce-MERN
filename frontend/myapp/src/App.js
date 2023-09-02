

import "./App.css";
import Header from "./component/layout/Header/Header";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import WebFont from "webfontloader";
import { useEffect,useState } from "react";
// import { Switch } from "react-router-dom";
import React from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store"
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions"
import { useSelector } from "react-redux";
import Profile  from "./component/User/Profile"
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile"
import UpdatePassword from "./component/User/UpdatePassword"
import ForgotPassword from "./component/User/ForgotPassword"
import ResetPassword from "./component/User/ResetPassword"
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import axios from "axios";
import Payment from "./component/Cart/Payment.js"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList.js"
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct.js"
import OrderList from "./component/Admin/OrderList";
import UsersList from "./component/Admin/UsersList";
import ProcessOrder from "./component/Admin/ProcessOrder"
import UpdateUser from "./component/Admin/UpdateUser"
import ProductReviews from "./component/Admin/ProductReviews"
import NotFound from "./component/layout/Not Found/NotFound";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";

function App() {

  const {isAuthenticated,user} = useSelector(state=>state.user)

  const [stripeApiKey,setStripeApiKey] = useState(""); 

  async function getStripeApiKey(){
    const{data} = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", " Chilanka"],
      },
    });
    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  // window.addEventListener("contextmenu",(e)=>e.preventDefault());

  return (
    <Router>
      <Header />
        {isAuthenticated && <UserOptions user = {user}/>}

       {stripeApiKey && (
         <Elements stripe = {loadStripe(stripeApiKey)}> 
         <Route path="/process/payment" element= {<ProtectedRoute  element={<Payment/>} />}/>
           
            </Elements>
       )}

      <Routes>
       
  {/* <Switch> */}
        <Route path="/" element={<Home/> } />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/search" element={<Search />} />
        <Route  path="/contact" element={<Contact/>} />
        <Route  path="/about" element={<About/>} /> 
        <Route path="/products/:keyword" element={<Products />} />


        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignUp />} />
        
        <Route path="/account" element = {<ProtectedRoute  element={<Profile />} />}/>
        

          <Route  path="/me/update" element= {<ProtectedRoute  element={<UpdateProfile />} />}/>
          <Route path="/password/update" element= {<ProtectedRoute element={<UpdatePassword/>} />}/>
          <Route path="/shipping" element= {<ProtectedRoute  element={<Shipping/>} />}/>
        <Route path="/password/forgot" element={<ForgotPassword/>} />
        <Route path="/password/reset/:token" element={<ResetPassword/>} />

        

          <Route path="/orders" element= {<ProtectedRoute element={<MyOrders/>} />}/>
          <Route path="/success"  element = {<ProtectedRoute  element={<OrderSuccess/>} />}/>
  
          <Route path="/order/:id" element = {<ProtectedRoute  element={<OrderDetails/>} />}/>
    <Route path="/order/confirm" element = {<ProtectedRoute  element={<ConfirmOrder/>} />}/>

{/* switch function se ek time p ek hi chiz rendor hogi */}

    <Route path="/admin/products"  element = {<ProtectedRoute isAdmin = {true}  element={<ProductList/>} />}/>
    <Route path="/admin/dashboard" element = {<ProtectedRoute isAdmin = {true}   element = {<Dashboard/>} />}/>
    <Route  path="/admin/product"  element = {<ProtectedRoute isAdmin = {true} element={<NewProduct/>} />}/>
    <Route  path="/admin/product/:id" element = {<ProtectedRoute isAdmin = {true}   element={<UpdateProduct/>} />}/>
    <Route  path="/admin/orders"  element = {<ProtectedRoute isAdmin = {true} element={<OrderList/>} />}/>
    <Route  path="/admin/order/:id" element = {<ProtectedRoute isAdmin = {true} element={<ProcessOrder/>} />}/>
    <Route  path="/admin/users" element = {<ProtectedRoute isAdmin = {true}  element={<UsersList/>} />}/>
    <Route path="/admin/user/:id" element = {<ProtectedRoute isAdmin = {true}   element={<UpdateUser/>} />}/>
    <Route path="/admin/reviews" element = {<ProtectedRoute isAdmin = {true} element={<ProductReviews/>} />}/>

  <Route element={window.location.pathname === "/process/payment"?null:NotFound} />

  {/* </Switch> */}
      </Routes>


      <Footer />
    </Router>
  );
}

export default App;
