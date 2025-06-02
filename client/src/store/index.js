import { createStore, applyMiddleware } from "redux";

import {thunk} from "redux-thunk";
export const SET_WISHLIST = "SET_WISHLIST";
export const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
export const REMOVE_FROM_WISHLIST = "REMOVE_FROM_WISHLIST";
export const CREATE_ITEM = "CREATE_ITEM";
export const SET_ITEMS = "SET_ITEMS";
export const DELETE_ITEM = "DELETE_ITEM"
export const UPDATE_ITEM = "UPDATE_ITEM"







let ItemReducer = (state = {item:[],wishlist:[]},action) => {
    let tempObj = action.payload
    console.log(tempObj)

    if(action.type === 'CREATE_ITEM'){
        console.log("to be added into state" + tempObj)
        return{
            ...state,item:[...state.item,tempObj]
        }
        
    }if (action.type === SET_ITEMS) {
    return { 
        ...state, 
        item: action.payload.map(item => ({ ...item, _id: item._id || item.id })) // ✅ Ensures `_id` is assigned
    };
}
if (action.type === "DELETE_ITEM") {
    return {
        ...state,
        item: state.item.filter(item => item._id !== action.payload), // ✅ Use `_id` to correctly identify item
    };
}

    // if (action.type === "TOGGLE") {
    //     return {
    //         ...state,
    //         todo: state.todo.map(task =>
    //             task.id === action.payload ? { ...task, completed: !task.completed } : task
    //         )
    //     };
    // }
    if (action.type === "SET_WISHLIST") {
    return { 
        ...state, 
        wishlist: Array.isArray(action.payload) 
            ? action.payload.map(item => ({ ...item, _id: item._id || item.id })) 
            : [] 
    };
}

// if (action.type === "ADD_TO_WISHLIST") {
//     return { 
//         ...state, 
//         wishlist: [...state.wishlist, action.payload] 
//     };
// }
if (action.type === "ADD_TO_WISHLIST") { 
    return {  
        ...state,  
        wishlist: [...state.wishlist, action.payload]  
    };
}

if (action.type === "UPDATE_ITEM") {
    return {
        ...state,
        item: state.item.map(item => item._id === action.payload._id ? action.payload : item),
    };
}    


if(action.type === "REMOVE_FROM_WISHLIST"){
    return {
        ...state,
        wishlist: state.wishlist.filter(item => item._id !== action.payload) 
    };
}
    


    
    return state
    }


let store = createStore(ItemReducer,applyMiddleware(thunk))
export default store