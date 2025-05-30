import { useNavigate } from "react-router-dom"
import ItemCreate from "./ItemCreate"
import ItemList from "./ItemList"

const Home = () => {


    const navigate = useNavigate()
    function handleLogout(){
    
      localStorage.removeItem("token")
      navigate('/')
    }



    return(
        <div>
            <h1>LoggedIN Home page</h1>
            <ItemCreate/>
            <ItemList/>
            <button type="button" onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Home