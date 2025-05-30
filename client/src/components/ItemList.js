import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid"; // Import UUID function
import { useSelector } from "react-redux";
import '../App.css'
import { useState } from "react";
import { useEffect } from "react";
import { SET_WISHLIST, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST ,SET_ITEMS,DELETE_ITEM} from "../store"; // Ensure correct path



import {jwtDecode} from "jwt-decode"; // Install with: npm install jwt-decode

export default function ItemList(){
    const dispatch = useDispatch();


const token = localStorage.getItem("token");
const userId = token ? jwtDecode(token).id : null;

const items = useSelector(state => state.item);
const fetchItems = () => async (dispatch) => {
    try {
        const response = await fetch("http://localhost:5000/items");
        const data = await response.json();
        dispatch({ type: SET_ITEMS, payload: data.items }); // ✅ Dispatch result
    } catch (error) {
        console.error("Error fetching items:", error);
    }
};

useEffect(() => {
    dispatch(fetchItems()); // ✅ Correct: Calls fetchItems as Redux Thunk action
}, [dispatch]);



const fetchWishlist = () => async (dispatch) => {
    try {
        const response = await fetch(`http://localhost:5000/user/${userId}/wishlist`);
        const data = await response.json();
        dispatch({ type: SET_WISHLIST, payload: data.wishlist });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
    }
};

const addToWishlist = (userId, itemId) => async (dispatch) => {
    try {
        await fetch("http://localhost:5000/wishlist/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, itemId }),
        });

        dispatch({ type: ADD_TO_WISHLIST, payload: itemId });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
    }
};

const removeFromWishlist = (userId, itemId) => async (dispatch) => {
    try {
        await fetch("http://localhost:5000/wishlist/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, itemId }),
        });

        dispatch({ type: REMOVE_FROM_WISHLIST, payload: itemId });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
    }
};
const handleDelete = async (itemId) => {
    if (!itemId || itemId === "undefined") { // ✅ Prevent passing an undefined value
        console.error("Error: itemId is invalid.");
        return;
    }

    try {
        console.log(`Deleting item with ID: ${itemId}`); // ✅ Debugging log

        await fetch(`http://localhost:5000/items/delete/${itemId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        dispatch({
            type: DELETE_ITEM,
            payload: itemId, 
        });

    } catch (error) {
        console.error("Error deleting item:", error);
    }
};
return (
        <div>
            {items.map(item => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <button onClick={() => {
                        console.log("Deleting item with ID:", item._id); 
                        handleDelete(item._id)}}>Delete</button>

                </div>
            ))}
        </div>
    );
};

