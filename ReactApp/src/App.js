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
const ROLES = {
  "Owner": 9971,
  "Admin": 1573,
  "Owner_Unlimited": 9962
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin></PersistLogin>}>
          {/*Public pages*/}
          <Route path="/smjestaj/:id" element={<AccomodationSingle></AccomodationSingle>}></Route>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="linkpage" element={<LinkPage></LinkPage>}></Route>
          <Route path="prijava" element={<Login />} />
          <Route path="registracija" element={<Register />} />
          {/*Private pages*/}
          <Route element={<RequireAuth allowedRoles={[ROLES.Owner]}></RequireAuth>}>
            <Route path="profile" element={<HomePage></HomePage>}></Route>
            <Route path="dodaj_smjestaj" element={<AddAccomodationForm></AddAccomodationForm>}></Route>
          </Route>
        </Route>
        {/*Other pages*/}
      </Route>
    </Routes>
  );
}

export default App;
