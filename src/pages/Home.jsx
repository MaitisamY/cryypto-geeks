import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BsCaretDown, BsCaretUp, BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs'
function Home() {
  const [coins, setCoins] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL_BY_VOL_FULL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const fetchCoins = async () => {
      try {
        const response = await axios.get(API_URL + '&api_key=' + API_KEY);
        setCoins(response.data.Data);
        console.log(response.data.Data);
      } catch (error) {
        console.error(error);
        setCoins({ error: error.message });
      }
    };
    fetchCoins();

    // Polling interval in milliseconds (e.g., every 5 minutes)
    const pollingInterval = 5 * 60 * 1000;

    // Start polling
    const intervalId = setInterval(fetchCoins, pollingInterval);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);

  }, []);

  return (
    <div className="home">
      <h1>Cryptocurrencies</h1>
      <table>
        <thead>
        <tr>
          <th className="text-left">#</th>
          <th className="text-left">Coin Name</th>
          <th className="text-right">Market Cap</th>
          <th className="text-right">Price</th>
          <th className="text-right">Volume 24h</th>
          <th className="text-right">Change 1h</th>
        </tr>
        </thead>
        <tbody>
          {coins ? (
            coins.map((coin, index) => (
              <tr key={coin.CoinInfo.Id}>
                <td className="text-left">{index + 1}</td>
                <td>
                  <Link target='_blank' className="coin-identity" to={`https://www.cryptocompare.com${coin.CoinInfo.Url}`}>
                    <img src={`https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`} alt={coin.CoinInfo.FullName} />
                    {coin.CoinInfo.FullName}
                    <span>{coin.CoinInfo.Internal}</span>
                  </Link>
                </td>
                {coin.RAW && coin.RAW.USD ? (
                  <>
                    <td className="text-right">{coin.RAW.USD.MKTCAP}</td>
                    <td className="text-right">{coin.RAW.USD.PRICE}</td>
                    <td className="text-right">{coin.RAW.USD.VOLUME24HOUR}</td>
                    <td className="text-right">
                      {coin.RAW.USD.CHANGEHOUR > 0 ? (
                        <span className="increment">
                          <BsFillCaretUpFill /> {coin.RAW.USD.CHANGEHOUR.toString().substring(0, 12).replace('-', '')}... %
                        </span>
                      ) : (
                        <span className="decrement">
                          <BsFillCaretDownFill /> {coin.RAW.USD.CHANGEHOUR.toString().substring(1, 12).replace('-', '')}... %
                        </span>
                      )}
                    </td>
                    {/* Add more properties as needed */}
                  </>
                ) : (
                  <td className="text-center" colSpan="4">Data not available</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
