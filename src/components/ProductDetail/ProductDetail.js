import React,{ useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';

const ProductDetail = () => {
    const {productKey} = useParams();
    const [product, setProduct] = useState({}); 

    useEffect(() => {
        fetch('https://limitless-ridge-07841.herokuapp.com/product/'+productKey)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setProduct(data);
        });
    },[productKey])

    // const product = fakeData.find(pd => pd.key === productKey);

    return (
        <div>
            <h1>Your product details</h1>
            <Product showAddToCart={false} product={product}></Product>
        </div>
    );
};

export default ProductDetail;