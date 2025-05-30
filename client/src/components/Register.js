import { useState } from "react";
import axios from 'axios'


const Register = () => {
    const [formData,setFormData] = useState({name:'',email:'',password:''})

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
    try {
        const response = await axios.post("http://localhost:5000/register", formData, {
            headers: { "Content-Type": "application/json" },
        });
        alert(response.data.message);
    } catch (error) {
        console.error("Error registering user:", error);
        alert("Registration failed");
    }

    }
    return(
        <div>
            <form onSubmit={handleSubmit}>

                
            <input type="text" name="name" onChange={handleChange} placeholder="Name" required />
            <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
            <button type="submit">Register</button>
        

            </form>
        </div>
    )
}

export default Register