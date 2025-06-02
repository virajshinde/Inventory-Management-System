import Login from "./Login"
import Register from "./Register"
import '../App.css'

export default function LoginRegisterHome () {




    return(
       <div className="header-container">
    <div className="brand-section">
        <img 
            src="/Copilot_20250602_082319.png" 
            alt="Brand Logo" 
            className="brand-logo"
        />
        <h1>Inventory Management System</h1>
    </div>
    <div className="auth-buttons">
        <Login />
        <Register />
    </div>
</div>

    )


}