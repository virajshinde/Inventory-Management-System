import { useDispatch, useSelector } from "react-redux";
import { SET_WISHLIST, REMOVE_FROM_WISHLIST ,SET_ITEMS} from "../store";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function WishList() {
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state.wishlist || []);
    const items = useSelector(state => state.item || []);

    // Get user ID from stored token
    const token = localStorage.getItem("token");
    const userId = token ? jwtDecode(token).id : null;

    // Fetch wishlist on mount

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

useEffect(() => {
    dispatch(fetchItems());
    if (userId) {  // ✅ Ensure userId exists before calling fetchWishlist
        dispatch(fetchWishlist());
    }
}, [dispatch, userId]);
    // Function to remove an item from the wishlist
    const removeFromWishlist = async (itemId) => {
        try {
            if (!userId) {
                alert("Please log in to remove items from your wishlist!");
                return;
            }

            await fetch("http://localhost:5000/wishlist/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, itemId }),
            });

            dispatch({ type: REMOVE_FROM_WISHLIST, payload: itemId });
            alert("Item removed from wishlist!");
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
        }
    };

    return (
        <div>
            <h2>Wishlist Items</h2>
            {wishlist.length > 0 ? (
                wishlist.map(itemId => {
                    const item = items.find(i => i._id === itemId);
                    return item ? (
                        <div key={item._id}>
                            <h3>{item.name}</h3>
                            <button onClick={() => removeFromWishlist(item._id)}>Remove from Wishlist</button>
                        </div>
                    ) : null;
                })
            ) : (
                <p>Your wishlist is empty.</p>
            )}
        </div>
    );
}