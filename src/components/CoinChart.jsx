import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Baseurl } from './baseUrl';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Loader from './Loader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const currencySymbols = {
  inr: '₹',
  usd: '$',
  eur: '€',
};

const CoinChart = ({ currency, low24h, high24h }) => {
  const [chartData, setChartData] = useState([]);
  const [firstPrice, setFirstPrice] = useState(null);
  const { id } = useParams();
  const [days, setDays] = useState(1);

  const fetchChartData = async () => {
    try {
      const { data } = await axios.get(
        `${Baseurl}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
      );
      setChartData(data.prices);
      if (data.prices.length > 0) {
        setFirstPrice(data.prices[0][1]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [currency, id, days]);


  const data = {
    labels: chartData.map((value) => {
      const date = new Date(value[0]);
      const time =
        date.getHours() > 12
          ? `${date.getHours() - 12}:${String(date.getMinutes()).padStart(2, '0')} PM`
          : `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} AM`;
      return days === 1 ? time : date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `Price in Past ${
          days === 1 ? '24 Hours' : days === 30 ? '1 Month' : '1 Year'
        } in ${currency.toUpperCase()}`,
        data: chartData.map((value) => value[1]),
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.2)',
        pointBackgroundColor: 'orange',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        position: 'nearest',
        yAlign: 'top',
        callbacks: {
          label: (context) => {
            const val = context.parsed.y;
            const symbol = currencySymbols[currency.toLowerCase()] || '';
            return `Price: ${symbol}${val.toLocaleString('en-IN', {
              maximumFractionDigits: 2,
            })}`;
          },
        },
        backgroundColor: '#111',
        borderColor: 'orange',
        borderWidth: 1,
        titleColor: 'white',
        bodyColor: 'white',
      },
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const symbol = currencySymbols[currency.toLowerCase()] || '';


  const lowTrend = low24h && firstPrice ? (low24h > firstPrice ? 'up' : 'down') : null;
  const highTrend = high24h && firstPrice ? (high24h > firstPrice ? 'up' : 'down') : null;

  return (
    <>
      {chartData.length === 0 ? (
        <Loader />
      ) : (
        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <Line data={data} options={options} style={{ width: '60rem', margin: '0 auto' }} />

          <div
            className="btn"
            style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <button
              onClick={() => setDays(1)}
              style={{
                backgroundColor: days === 1 ? 'darkorange' : 'orange',
                padding: '0.6rem 1.4rem',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              24 Hours
            </button>
            <button
              onClick={() => setDays(30)}
              style={{
                backgroundColor: days === 30 ? 'darkorange' : 'orange',
                padding: '0.6rem 1.4rem',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              1 Month
            </button>
            <button
              onClick={() => setDays(365)}
              style={{
                backgroundColor: days === 365 ? 'darkorange' : 'orange',
                padding: '0.6rem 1.4rem',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              1 Year
            </button>
          </div>


          {low24h !== undefined && high24h !== undefined && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.8rem 1.2rem',
                borderRadius: '8px',
                backgroundColor: '#111',
                color: 'orange',
                fontSize: '1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '4rem',
                fontWeight: '500',
              }}
            >
              <div>
                {lowTrend === 'up' ? (
                  <span style={{ color: 'limegreen', marginRight: '5px' }}>▲</span>
                ) : (
                  <span style={{ color: 'red', marginRight: '5px' }}>▼</span>
                )}
                24h Low:{' '}
                <span style={{ color: 'white' }}>
                  {symbol}
                  {low24h.toLocaleString()}
                </span>
              </div>
              <div>
                {highTrend === 'up' ? (
                  <span style={{ color: 'limegreen', marginRight: '5px' }}>▲</span>
                ) : (
                  <span style={{ color: 'red', marginRight: '5px' }}>▼</span>
                )}
                24h High:{' '}
                <span style={{ color: 'white' }}>
                  {symbol}
                  {high24h.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CoinChart;
