import React, { useEffect, useState } from 'react';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link } from 'react-router-dom';


const Shop = () => {
    // const first10 = fakeData.slice(0, 10);
    // const [products, setProducts] = useState(first10);
    
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('https://limitless-ridge-07841.herokuapp.com/products')
        .then(res=>res.json())
        .then(data =>{
            setProducts(data);
        })
    },[])

    useEffect(() => {
        const savedCard = getDatabaseCart();
        const productKeys = Object.keys(savedCard);
        // if(products.length>0){
        //     const previousCart = productKey.map(pdKey => {
        //         const product = products.find(pd => pd.key === pdKey);
        //         product.quantity = savedCard[pdKey];
        //         return product;
        //     })
        //     setCart(previousCart);
        // }
        fetch('https://limitless-ridge-07841.herokuapp.com/productsByKeys',{
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))
    }, [])

    const handleAddProduct = (product) => {
        const toBeAddedKey = product.key;
        const sameProduct = cart.find(pd => pd.key === toBeAddedKey);
        let count = 1;
        let newCart;
        if (sameProduct) {
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key != toBeAddedKey);
            newCart = [...others, sameProduct];
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product]
        }



        // const newCart = [...cart,product];
        setCart(newCart);
        // const sameProduct = newCart.filter(pd => pd.key === product.key);
        // const count = sameProduct.length;
        // cart.quantity = count;
        addToDatabaseCart(product.key, count);
    }

    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    products.map(pd => <Product key={pd.key} showAddToCart={true} handleAddProduct={handleAddProduct} product={pd}></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link to="/review">
                        <button className="main-button">Review Order</button>
                    </Link>
                </Cart>
            </div>
        </div>
    );
};

export default Shop;