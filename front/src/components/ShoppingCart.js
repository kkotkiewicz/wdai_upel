import React from 'react';
import '../styles/components/ShoppingCart.css';

function ShoppingCart({shoppingCart, closeCart, deleteFromCart}) {
    return (
        <div className={"outside"}>
            <div className="shopping-cart">
                <h2>Shopping Cart</h2>
                <ul>
                    {shoppingCart.map((course, index) => (
                        <div className={"item"}>
                            <p key={index}> {course.course_name} : {course.course_price} </p>
                            <button key={index} onClick={deleteFromCart(course)}>Usuń</button>
                        </div>
                    ))}
                </ul>
                <h4>Suma:  {shoppingCart.reduce((sum, course) => sum + course.course_price, 0)}</h4>
                <button onClick={closeCart}> Zamknij </button>
            </div>
        </div>
    );
}

export default ShoppingCart;