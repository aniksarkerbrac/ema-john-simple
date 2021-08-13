import React from 'react';

const Cart = (props) => {
    return (
        <div>
            <h4>Order Summer: </h4>
            <p>Items Ordered: {props.cart.length}</p>
        </div>
    );
};

export default Cart;