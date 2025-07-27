import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { Baseurl } from './baseUrl';
import Loader from './Loader';
import './Exchanges.css';

const Exchanges = () => {
  const [loading, setLoading] = useState(true);
  const [exchanges, setExchanges] = useState([]);
  const [filteredExchanges, setFilteredExchanges] = useState([]);

  useEffect(() => {
    const getExchangesData = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}/exchanges`);
        setExchanges(data);
        setFilteredExchanges(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchanges:', error);
        setLoading(false);
      }
    };

    getExchangesData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          

          <div
            className="ex-cards ex-header"
            style={{
              fontWeight: 'bold',
              color: 'orange',
              borderBottom: '2px solid orange',
              marginBottom: '1rem',
            }}
          >
            <div className="image">Logo</div>
            <div className="name">Name</div>
            <div className="price">24h Volume </div>
            <div className="rank">Rank</div>
          </div>

          {filteredExchanges.map((item, i) => (
            <div key={i} className="ex-cards">
              <div className="image">
                <img height="80px" src={item.image} alt={item.name} />
              </div>
              <div className="name">{item.name}</div>
              <div className="price">{item.trade_volume_24h_btc.toFixed(0)}</div>
              <div className="rank">{item.trust_score_rank}</div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Exchanges;
