import './App.css';
import { Routes, Route } from 'react-router-dom';
import Exchanges from './components/Exchanges';
import Coins from './components/Coins';
import CoinDetails from './components/CoinDetails';
import Layout from './components/layout'; 

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Exchanges />} />
        <Route path='/coins' element={<Coins />} />
        <Route path='/coins/:id' element={<CoinDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
