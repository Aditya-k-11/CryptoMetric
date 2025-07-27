import React, { useState, useEffect } from 'react';
import { Baseurl } from './baseUrl';
import Loader from './Loader';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import './Res.css';

const Coins = () => {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState('usd');
  const [search, setSearch] = useState('');
  const currencySymbol = currency === 'inr' ? '₹' : '$';

  useEffect(() => {
    const getCoinsData = async () => {
      try {
        const { data } = await axios.get(
          `${Baseurl}/coins/markets?vs_currency=${currency}`
        );
        setCoins(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getCoinsData();
  }, [currency]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Your Coins"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="btns">
            <button onClick={() => setCurrency('inr')}>INR</button>
            <button onClick={() => setCurrency('usd')}>USD</button>
          </div>

          {/* Table Header */}
          <div className="table-header">
            <div>Rank</div>
            <div>Coin</div>
            <div>Icon</div>
            <div>Price</div>
            <div>24h Change</div>
          </div>

          {/* Coin List */}
          {coins
            .filter((data) =>
              data.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((coindata, i) => (
              <CoinCard
                key={i}
                coindata={coindata}
                id={coindata.id}
                i={i}
                currencySymbol={currencySymbol}
              />
            ))}
        </>
      )}
    </>
  );
};

const CoinCard = ({ coindata, currencySymbol, i, id }) => {
  const profit = coindata.price_change_percentage_24h > 0;

  return (
    <Link to={`/coins/${id}`} style={{ textDecoration: 'none' }}>
      <div className="coin-row">
        <div className="coin-cell rank-cell">#{coindata.market_cap_rank}</div>
        <div className="coin-cell name-cell">{coindata.name}</div>
        <div className="coin-cell icon-cell">
          <img src={coindata.image} alt={coindata.name} />
        </div>
        <div className="coin-cell price-cell">
          {currencySymbol} {coindata.current_price.toFixed(0)}
        </div>
        <div
          className={`coin-cell change-cell ${profit ? 'profit' : 'loss'}`}
        >
          {profit ? '+' : ''}
          {coindata.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
    </Link>
  );
};

export default Coins;
