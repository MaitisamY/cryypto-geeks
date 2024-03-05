/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto';
import axios from 'axios'
import ReactMarkdown from 'react-markdown';
import convertUnixTimestamp from '../util/TimeStampChanger'
export default function Coin() {
    const { name } = useParams();
    const [coin, setCoin] = useState('');
    const [chartData, setChartData] = useState({
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            id: 1,
            label: 'Profit',
            data: [710000, 690000, 890000, 820000, 710000, 560000],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            tension: 0.1
          },
          {
            id: 2,
            label: 'Loss',
            data: [650000, 590000, 800000, 810000, 560000, 550000],
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)', // Border color
            borderWidth: 1, // Border width
            tension: 0.5
          }
        ]
    });
    
      const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false,
            color: 'var(--color)',
            padding: 10
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y + ' ' + context.dataset.label;
              },
            },
          },
          hover: {
            mode: 'index',
            intersect: false
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: false,
              font: {
                size: 14,
                weight: 600,
                style: 'normal',
                lineHeight: 1.2,
                family: 'Poppins, sans-serif',
              },
              color: '#000000',
              padding: 10
            },
          },
          y: {
            display: true,
            title: {
              display: false,
              font: {
                size: 14,
                weight: 600,
                style: 'normal',
                lineHeight: 1.2,
                family: 'Poppins, sans-serif',
              },
              color: '#000000',
              padding: 10
            },
          },
        },
        elements: {
          point: {
            borderWidth: 0,
          },
        },
        animation: {
          duration: 0.5,
          easing: 'easeInQuad',
          loop: false,
          lazy: true,
          autoplay: true,
          animationData: null,
          animationOptions: null
        },
        layout: {
          padding: 10
        }
    };

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL_SINGLE_COIN_BY_SYMBOL;
        const API_KEY = import.meta.env.VITE_API_KEY;
        
        const fetchThisCoin = async () => {
            try {
                const response = await axios.get(`${API_URL}symbol?asset_symbol=${name}&api_key=${API_KEY}`);
                setCoin(response.data.Data);
            } catch (error) {
                console.error(error);
                setCoin({ error: error.message });
            }
        };
        
        fetchThisCoin();
        
        // Fetch updated data every second
        const intervalId = setInterval(fetchThisCoin, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const metaData = () => {
            document.title = `${coin.NAME} | Cryypto Geeks`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', coin.SEO_DESCRIPTION);
            }
        }
    
        metaData();
    }, [coin]); // Add coin as a dependency

    return (
        <div className="coin">
            <div className="crypto-coin-description">
                {
                    coin && (
                        <>
                            <h1>
                                <img src={coin.LOGO_URL} alt={coin.NAME} /> 
                                {coin.NAME} <small>{coin.SYMBOL}</small>
                            </h1>
                            <h2>$ {coin.PRICE_USD ? parseFloat(coin.PRICE_USD).toFixed(2) : '0.00'}</h2>
                            <h3>Last update: {convertUnixTimestamp(coin.PRICE_USD_LAST_UPDATE_TS)}</h3>
                            <div className="two-rowed-table">
                                <table>
                                    <tr>
                                        <th>Smart contract address</th>
                                    </tr>
                                    <tr>
                                        <td>{coin.SMART_CONTRACT_ADDRESS}</td>
                                    </tr>
                                </table>
                            </div>
                            <p><ReactMarkdown>{coin.ASSET_DESCRIPTION}</ReactMarkdown></p>
                        </>
                    )
                }
            </div>
            <div></div>
            <div className="crypto-coin-chart">
                <div style={{ width: '100%', height: '75vh' }}>
                  <Line data={chartData} options={options} />
                </div>
            </div>
        </div>
    )
}
