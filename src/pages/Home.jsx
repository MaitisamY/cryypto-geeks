import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BsFillCaretDownFill, BsFillCaretUpFill, BsSearch, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import Card from '../components/Card'
function Home() {
    const [coins, setCoins] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [originalCoins, setOriginalCoins] = useState(null);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL_BY_VOL_FULL;
        const API_KEY = import.meta.env.VITE_API_KEY;
        
        const fetchCoins = async () => {
            try {
                const response = await axios.get(`${API_URL}?limit=100&tsym=USD&api_key=${API_KEY}`);
                setCoins(response.data.Data);
                setOriginalCoins(response.data.Data);
            } catch (error) {
                console.error(error);
                setCoins({ error: error.message });
            }
        };
        
        fetchCoins();

        function handleStickyColumns() {
          var table = document.getElementById('crypto-table');
          var minWidth = 992; 
      
          if (window.innerWidth < minWidth) {
            table.classList.add('sticky-columns');
          } else {
            table.classList.remove('sticky-columns');
          }
        }
      
        handleStickyColumns();
        window.addEventListener('resize', handleStickyColumns);
        
        const pollingInterval = 60 * 60 * 1000;
        const intervalId = setInterval(fetchCoins, pollingInterval);
        
        return () => clearInterval(intervalId);
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset pagination when searching
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleShowRows = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset pagination when changing rows per page
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = currentPage * rowsPerPage;
    const filteredCoins = coins && searchQuery.length >= 1
        ? coins.filter((coin) => coin.CoinInfo.FullName.toLowerCase().includes(searchQuery.toLowerCase()))
        : coins;
    const currentRows = filteredCoins ? filteredCoins.slice(startIndex, endIndex) : [];

    const totalPages = filteredCoins ? Math.ceil(filteredCoins.length / rowsPerPage) : 0;

    


  return (
    <div className="home">{/* Main Container */}
      <div className="crypto-cards-container">{/* Cards Container */}
          <Card>
              <h1>Cryptocurrencies</h1>
          </Card>
      </div>
      <div className="controllers">
          <form>
              <span><BsSearch /></span> 
              <input type="text" name="search" value={searchQuery} placeholder="Filter by coin name..." onChange={handleSearch} />
          </form>
          <div className="show-rows">
              <label>Selected rows:</label>
              <select onChange={handleShowRows}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
              </select>
          </div>
      </div>
      <div className="crypto-table-wrapper">{/* Table Wrapper Container */}
        <table id="crypto-table">
          <thead>
          <tr>
            <th className="text-left">#</th>
            <th className="text-left">Coin Name</th>
            <th className="text-right">Market Cap</th>
            <th className="text-right">Price</th>
            <th className="text-right">Volume 24h</th>
            <th className="text-right">Change 24h</th>
          </tr>
          </thead>
          <tbody>
            {coins ? (
              currentRows.map((coin, index) => (
                <tr key={index}>
                  <td className="text-left">{coins.indexOf(coin) + 1}</td>
                  <td>
                    <Link className="coin-identity" to={`coin/overview/${coin.CoinInfo.Internal}`}>
                      <img src={`https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`} alt={coin.CoinInfo.FullName} />
                      {coin.CoinInfo.FullName}
                      <span>{coin.CoinInfo.Internal}</span>
                    </Link>
                  </td>
                  {coin.RAW && coin.RAW.USD ? (
                    <>
                      <td className="text-right">
                        $ {coin.RAW.USD.MKTCAP ? (parseFloat(coin.RAW.USD.MKTCAP).toFixed(2) >= 1000000 ? 
                        (parseFloat(coin.RAW.USD.MKTCAP) / 1000000000).toFixed(2) + ' B' : 
                        parseFloat(coin.RAW.USD.MKTCAP).toFixed(2)) : '0.00'}
                      </td>
                      <td className="text-right">
                        $ {coin.RAW.USD.PRICE ? parseFloat(coin.RAW.USD.PRICE).toFixed(2) : '0.00'}
                      </td>
                      <td className="text-right">
                        $ {coin.RAW.USD.VOLUME24HOUR ? (parseFloat(coin.RAW.USD.VOLUME24HOUR).toFixed(2) >= 1000000000 ? 
                        (parseFloat(coin.RAW.USD.VOLUME24HOUR) / 1000000000).toFixed(2) + 'B' : 
                        parseFloat(coin.RAW.USD.VOLUME24HOUR).toFixed(2)) : '0.00'}
                      </td>
                      <td className="text-right">
                        {coin.RAW.USD.CHANGE24HOUR > 0 ? (
                          <span className="increment">
                            <BsFillCaretUpFill /> {Math.abs(parseFloat(coin.RAW.USD.CHANGE24HOUR)).toFixed(2)}... %
                          </span>
                        ) : (
                          <span className="decrement">
                            <BsFillCaretDownFill /> {Math.abs(parseFloat(coin.RAW.USD.CHANGE24HOUR)).toFixed(2)}... %
                          </span>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="text-right">--</td>
                      <td className="text-right">--</td>
                      <td className="text-right">--</td>
                      <td className="text-right">--</td>
                    </>
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
      <div className="crypto-pagination">
          <p>Current Page <span>{currentPage}</span>, out of total <span>{totalPages}</span> pages</p>
          <div className="btn-group">
              <button 
                  onClick={() => handlePreviousPage(currentPage - 1)} 
                  disabled={currentPage === 1}
                  title={currentPage === 1 ? "On First Page - No Previous Page Available" : "Go Backward"}
              >
                  <BsChevronLeft />
              </button>
              <button  
                  onClick={() => handleNextPage(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  title={currentPage === totalPages ? "On Last Page - No Next Page Available" : "Go Forward"}
              >
                  <BsChevronRight />
              </button>
          </div>
      </div>
    </div>
  );
}

export default Home;
