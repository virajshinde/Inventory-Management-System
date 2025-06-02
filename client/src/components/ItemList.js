import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import '../App.css';
import { SET_WISHLIST, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, SET_ITEMS, DELETE_ITEM, UPDATE_ITEM } from "../store";
import { jwtDecode } from "jwt-decode"; // Install with: npm install jwt-decode
import "../App.css"

export default function ItemList() {
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state.wishlist || []);
    const items = useSelector(state => state.item || []);
    const [editingItem, setEditingItem] = useState(null);

    // Get user ID from stored token
    const token = localStorage.getItem("token");
    const userId = token ? jwtDecode(token).id : null;

    console.log("User ID in frontend:", userId);

    const handleEdit = async (updatedItem) => {
        try {
            await fetch(`http://localhost:5000/items/update/${updatedItem._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItem),
            });

            dispatch({ type: UPDATE_ITEM, payload: updatedItem });
            alert("Item updated successfully!");
            setEditingItem(null);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    function EditItemForm({ item, onSave }) {
        const [itemName, setItemName] = useState(item.name);
        const [itemPrice, setItemPrice] = useState(item.price);
        const [itemCategory, setItemCategory] = useState(item.category);

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave({ ...item, name: itemName, price: itemPrice, category: itemCategory });
        };

        return (
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                </label>
                <label>
                    Price:
                    <input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
                </label>
                <label>
                    Category:
                    <input type="text" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} />
                </label>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingItem(null)}>Cancel</button>
            </form>
        );
    }

    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:5000/items");
            const data = await response.json();
            dispatch({ type: SET_ITEMS, payload: data.items });
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const fetchWishlist = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`http://localhost:5000/user/${userId}/wishlist`);
            const data = await response.json();
            dispatch({ type: SET_WISHLIST, payload: data.wishlist });
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchWishlist();
        }
    }, [userId]);

    const addToWishlist = async (itemId) => {
        try {
            if (!userId) {
                alert("Please log in to add items to your wishlist!");
                return;
            }

            const response = await fetch("http://localhost:5000/wishlist/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, itemId }),
            });

            if (!response.ok) {
                throw new Error("Failed to add item to wishlist");
            }

            const data = await response.json();
            console.log("Wishlist response:", data);

            const newItem = items.find(item => item._id === itemId);
            if (newItem) {
                dispatch({ type: ADD_TO_WISHLIST, payload: newItem });
            }

            fetchWishlist(); // Ensure wishlist updates properly
            alert("Item added to wishlist!");
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            if (!userId) {
                alert("Please log in to remove items from your wishlist!");
                return;
            }

            const response = await fetch("http://localhost:5000/wishlist/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, itemId }),
            });

            if (!response.ok) {
                throw new Error("Failed to remove item");
            }

            const data = await response.json();
            console.log("Updated wishlist after removal:", data.wishlist);

            dispatch({ type: SET_WISHLIST, payload: data.wishlist });
            fetchWishlist(); // Ensure wishlist updates properly
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
        }
    };

    const handleDelete = async (itemId) => {
        if (!itemId) {
            console.error("Error: itemId is invalid.");
            return;
        }

        try {
            console.log(`Deleting item with ID: ${itemId}`);

            await fetch(`http://localhost:5000/items/delete/${itemId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            dispatch({ type: DELETE_ITEM, payload: itemId });
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (<div>
       
        <div className="container" ><div className="items-container">
            <h2>Available Items</h2><br></br>
            {items.length > 0 ? (
                items.map(item => (
                    <div key={item._id}>
                        <h3>{item.name}</h3>
                        <p>Price: {item.price}</p>
                        <p>Category: {item.category}</p>
                        <div className="button-group">
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                        {wishlist.some(wishlistItem => wishlistItem._id === item._id) ? (
                            <button onClick={() => removeFromWishlist(item._id)}>Remove from Wishlist</button>
                        ) : (
                            <button onClick={() => addToWishlist(item._id)}>Add to Wishlist</button>
                        )}
                        <button onClick={() => setEditingItem(item)}>Edit</button>
                        </div>
                        {editingItem && editingItem._id === item._id && (
                            <EditItemForm
                                item={editingItem}
                                onSave={(updatedItem) => {
                                    handleEdit(updatedItem);
                                    setEditingItem(null);
                                }}
                            />
                        )}
                    </div>
                ))
            ) : (
                <p>No items available.</p>
            )}

            </div>

            <div className="wishlist-container"> 

            <h2>Wishlist</h2><br></br>
            {wishlist.length > 0 ? (
                wishlist.map(item => (
                    <div key={item._id}>
                        <h3>{item.name}</h3>
                        <button onClick={() => removeFromWishlist(item._id)}>Remove from Wishlist</button>
                    </div>
                ))
            ) : (
                <p>Your wishlist is empty.</p>
            )}
            </div>
        </div>
        </div>
    );
}