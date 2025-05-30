import { useState } from "react";
import { useDispatch } from "react-redux";

import { CREATE_ITEM } from "../store"; // Import action type



    const ItemCreate = () => {
        
    const [formData, setFormData] = useState({ name: "", price: "", category: "" });
    const dispatch = useDispatch();
    const createItem = async (itemData) => {
        try {
            const response = await fetch("http://localhost:5000/items/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(itemData),
            });

            const data = await response.json();
            return data.product; // Return the created product
        } catch (error) {
            console.error("Error creating item:", error);
            return null;
        }
    };





    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
         const newItem = await createItem(formData); // Call `createItem`
        if (newItem) {
            dispatch({ type: CREATE_ITEM, payload: newItem }); // Dispatch inside handleSubmit
            alert("Product created successfully!");
        }
  };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" onChange={handleChange} placeholder="Product Name" required />
                <input type="number" name="price" onChange={handleChange} placeholder="Price" required />
                <input type="text" name="category" onChange={handleChange} placeholder="Category" required />
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default ItemCreate;