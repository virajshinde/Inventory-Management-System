import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import LoginRegisterHome from './components/LoginRegisterHome';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/privateRoute';
import Home from './components/Home';

function App() {
  return (<Router>
      <div className="App">
       <Routes>
          <Route path="/" element={<LoginRegisterHome/>}/>
          <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>} />
          {/* <Route path="/create" element={<PrivateRoute><CreateContact contact={contact} setContact={setContact}/></PrivateRoute>} />
          <Route path="/display" element={<PrivateRoute><DisplayContact contact={contact} /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><EditContact contact={contact} setContact={setContact} /></PrivateRoute>} /> */}

        </Routes>

    </div>
    </Router>
  );
}

export default App;
