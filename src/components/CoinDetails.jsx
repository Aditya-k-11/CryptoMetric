import React, { useEffect, useState } from 'react'
import { Baseurl } from './baseUrl'
import Loader from './Loader'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './coinDetail.css'
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi"
import { IoPulseOutline } from "react-icons/io5"
import CoinChart from './CoinChart'

const CoinDetails = () => {
  const [coin, setCoin] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { id } = useParams()
  const [currency, setCurrency] = useState('inr')

  const currencySymbol = currency === 'inr' ? '₹' : '$'
  const profit = coin.market_data?.price_change_percentage_24h > 0

  useEffect(() => {
    const getCoin = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}/coins/${id}`)
        setCoin(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setError(true)
        setLoading(false)
      }
    }
    getCoin()
  }, [id])

  return (
    <>
      {loading ? (
        <Loader />
      ) : error || !coin.market_data ? (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '100px', fontSize: '2rem' }}>
          Error fetching coin details. Please try again later.
        </div>
      ) : (
          <div className='coin-detail'>
            <div className='coin-info'>
              <div className='btn'>
                <button onClick={() => setCurrency('inr')} >INR</button>
                <button onClick={() => setCurrency('usd')}>USD</button>
              </div>

              <div className="time">
                {coin.last_updated}
              </div>

              <div className="coin-image">
                
                <img
                  src={coin.image?.large || '/coin.png'}
                  alt={coin.name}
                  height="150px"
                />
              </div>

              <div className="coin-name">
                {coin.name}
              </div>

              <div className="coin-price">
                {currencySymbol} {coin.market_data.current_price[currency]}
              </div>

              <div className="coin-profit">
                {profit ? (
                  <BiSolidUpArrow color='green' />
                ) : (
                  <BiSolidDownArrow color='red' />
                )}
                {coin.market_data.price_change_percentage_24h} %
              </div>

              <div className='market-rank'>
                <IoPulseOutline color='orange' />
                #{coin.market_cap_rank}
              </div>

              <div className='coin-desc'>
                <p>{coin.description?.en?.split('.')[0]}</p>
              </div>
            </div>

            <CoinChart
              currency={currency}
              low24h={coin.market_data.low_24h[currency]}
              high24h={coin.market_data.high_24h[currency]}
            />
          </div>
        )
      }
    </>
  )
}

export default CoinDetails                              
