import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom"


const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
     const navigate = useNavigate()

     const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", formData, {
                headers: { "Content-Type": "application/json" },
            });

            alert(response.data.message);
            localStorage.setItem("token", response.data.token);
            navigate("/home")
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed. Please check your credentials.");
            navigate("/")
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );


}

export default Login