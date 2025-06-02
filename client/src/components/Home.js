import { useNavigate } from "react-router-dom"
import ItemCreate from "./ItemCreate"
import ItemList from "./ItemList"
import "../App.css"

const Home = () => {


    const navigate = useNavigate()
    function handleLogout(){
    
      localStorage.removeItem("token")
      navigate('/')
    }



    return(
        <div>
            <h1>Home page</h1>
            <div className="logout-wrapper">
    <button className="logout-button" onClick={handleLogout}>Logout</button>
</div>
            <ItemCreate/>
            <ItemList/>
             
        </div>
    )
}

export default Home