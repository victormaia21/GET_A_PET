import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './components/pages/Home';
import NavBar from './components/layouts/NavBar';
import Register from './components/pages/Register';
import Footer from './components/layouts/Footer';
import {UserProvider} from './context/userContext';
import Message from './components/layouts/Message';
import Login from './components/pages/Login';
import Profile from './components/Profile/Profile';
import MyPets from './components/pages/MyPets';
import PetsCreate from './components/pages/PetsCreate';
import UpdatePet from './components/pages/UpdatePet';
import Search from './components/pages/Search';
import PetAdoptions from './components/pages/PetAdoptions';
function App() {
  return (
    
      <div className="App">
        <BrowserRouter>
        <UserProvider>
        <NavBar/>
        <div className="container">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/mypets' element={<MyPets/>}/>
            <Route path='/pets/create' element={<PetsCreate/>}/>
            <Route path='/pets/edit/:id' element={<UpdatePet/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path='/pets/adoptions' element={<PetAdoptions/>}/>
          </Routes>
        </div>
        </UserProvider>
        </BrowserRouter>
      </div>
  );
}

export default App;
