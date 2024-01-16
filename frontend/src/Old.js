import React, {useState, useEffect} from 'react'
import {backend_api} from './api'
import AddTicker from './components/AddTicker';

const Old = () => {
  const [companies, setCompanies] = useState([]);

  const fetchAllData = async () => {
    try {
      const response = await backend_api.get('/api/stock');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log("useEffect running...");
    fetchAllData();
  }, []);

  return (
    <div>
      <nav className='navbar navbar-dark bg-primary'>
        <div className='container-fluid'>
          <a className='navbar-brand' href="#">Stock Metric Cards</a>
        </div>
      </nav>

      <div className='container'>
        <AddTicker onSubmit={fetchAllData}></AddTicker>
        <table className='table table-striped table-bordered table-hover'>
        <thead>
          <tr>
            <th>Ticker</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((t) => (
            <tr key={t.id}>
              <td>{t.ticker}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>


    </div>
  )
}

export default Old;
