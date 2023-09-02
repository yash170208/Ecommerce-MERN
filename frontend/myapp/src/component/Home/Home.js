import React, { Fragment, useEffect } from 'react';
import {BiMouse} from "react-icons/bi";
import "./Home.css";
import MetaData from "../layout/MetaData";
import {clearErrors, getProduct} from "../../actions/productAction";
import {useSelector,useDispatch } from 'react-redux';
import Loader from "../layout/Loader/Loader"
import { useAlert } from 'react-alert';
import ProductCard from './ProductCard.js';



// const product = {
//   name:"Blue T-shirt",
//   price:"3000",
//   _id:"abhishek",
//   images:[{url:"http://i.ibb.co/DRST11n/1.webp"}]
// }



const Home = () => {

const alert = useAlert();

  const dispatch = useDispatch();
const { loading ,error ,products} = useSelector((state)=>state.products);





  useEffect(()=>{

    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
dispatch(getProduct());
  },[dispatch,error,alert]);

 
  return (
   <Fragment>

    { loading ? (
    <Loader/>
      ):( 
      <Fragment> 

      <MetaData title = "ECOMMERCE"/>
      
      <div  class = "banner">   
      <p>Welcome to Our App</p>
      <h1>FIND AMAZING PRODUCTS BELOW</h1>
      
      <a href = "#container">
          <button>
              Scroll <BiMouse/>
            
          </button>
      </a>
      
      </div>
      
      <h2 className="homeHeading">Featured Products</h2>
      
      <div className = "container" id="container">
      
      {products && products.map((product)=> (<ProductCard /*key = {product._id}*/ product={product}/>))}


      </div>
          </Fragment>)}


   </Fragment>
  ) ;
}

export default Home









