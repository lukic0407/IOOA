import React from 'react';
import './App.css';
import logo from './logo.svg';
import Register from './Components/Register';
import Login from './Components/Login';
import Layout from './Components/Layout';
import RequireAuth from './Components/RequireAuth';
import { Routes, Route, Switch } from 'react-router-dom'
import HomePage from './Components/HomePage';
import LinkPage from './Components/LinkPage';
import PersistLogin from './Components/PersistLogin';
import AccomodationSingle from './Components/AccommodationSingle';
import AddAccomodationForm from './Components/AddAccomodationForm';
import Profile from './Components/Profile';
import Search from './Components/Search';
import Dashboard from './Components/Dashboard';
const ROLES = {
  "Owner": 9971,
  "Admin": 1573,
  "Owner_Unlimited": 9962
}

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin></PersistLogin>}>
        <Route path="/" element={<Layout />}>
          {/*Public pages*/}
          <Route path="/smjestaj/:id" element={<AccomodationSingle></AccomodationSingle>}></Route>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="linkpage" element={<LinkPage></LinkPage>}></Route>
          <Route path="prijava" element={<Login />} />
          <Route path="registracija" element={<Register />} />
          <Route path="/smjestaji/:category" element={<Search></Search>}></Route>
          <Route path="/smjestaji" element={<Search></Search>}></Route>
          {/*Private pages*/}
          <Route element={<RequireAuth allowedRoles={[ROLES.Owner]}></RequireAuth>}>
          <Route path="/profil" element={<Profile />}>
            <Route path="nadzorna_ploca" element={<Dashboard></Dashboard>}></Route>
            <Route path="dodaj_smjestaj" element={<AddAccomodationForm></AddAccomodationForm>}></Route>
          </Route>
          </Route>
        </Route>
        {/*Other pages*/}
      </Route>
    </Routes>
  );
}

export default App;
