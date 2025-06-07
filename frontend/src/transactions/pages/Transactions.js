import React, { useEffect, useState } from 'react';
import { MdDownload } from "react-icons/md";
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { motion } from "framer-motion";
import InvoicePDF from './InvoicePDF';
import LoadingSpinner from '../../shared/components/loader/LoadingSpinner';
import classes from './Transactions.module.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posterData, setPosterData] = useState({});
  const history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const API_KEY = 'd987bb3825166942aa314c4768160995';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/transactions/${userInfo.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data.trans || []);

        // Fetch poster data for all items
        if (data.trans && data.trans.length > 0) {
          const posterPromises = data.trans.flatMap(transaction => 
            transaction.movie_tv.map(async item => {
              try {
                const response = await fetch(
                  `https://api.themoviedb.org/3/${item.type}/${item.id}?api_key=${API_KEY}`
                );
                const movieData = await response.json();
                return {
                  id: item.id,
                  posterPath: movieData.poster_path || null
                };
              } catch (error) {
                console.error(`Error fetching poster for ${item.type} ID ${item.id}:`, error);
                return {
                  id: item.id,
                  posterPath: null
                };
              }
            })
          );

          const posterResults = await Promise.all(posterPromises);
          const posterMap = posterResults.reduce((acc, curr) => {
            acc[curr.id] = curr.posterPath;
            return acc;
          }, {});

          setPosterData(posterMap);
        }
      } catch (error) {
        toast.error('Failed to fetch transactions');
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userInfo.id]);

  const getPosterUrl = (item) => {
    const posterPath = posterData[item.id];
    if (!posterPath || posterPath.trim() === "") {
      return '/image-missing.jpg';
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  if (isLoading) {
    return (
      <div className={classes.container}>
        <LoadingSpinner/>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <h1>Your Transactions</h1>
      {transactions.length === 0 ? (
        <motion.div
          className={classes.emptyMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No transactions found! Your purchase history is empty.
        </motion.div>
      ) : (
        transactions.map((transaction) => (
          <motion.div 
            key={transaction.trans_id} 
            className={classes.transaction}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={classes.transactionHeader}>
              <h2>Order #{transaction.trans_id}</h2>
              <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            
            <table className={classes.transactionTable}>
              <thead>
                <tr>
                  <th className={classes.typeColumn}>Type</th>
                  <th className={classes.titleColumn}>Title</th>
                  <th className={classes.posterColumn}>Poster</th>
                  <th className={classes.quantityColumn}>Quantity</th>
                  <th className={classes.priceColumn}>Price</th>
                </tr>
              </thead>
              <tbody>
                {transaction.movie_tv.map((item) => (
                  <tr key={item.id}>
                    <td className={classes.typeColumn}>{item.type.toUpperCase()}</td>
                    <td className={classes.titleColumn}>{item.title}</td>
                    <td className={classes.posterColumn}>
                      <img 
                        src={getPosterUrl(item)} 
                        alt={item.title} 
                        className={classes.poster}
                        onError={(e) => {
                          e.target.src = '/image-missing.jpg';
                        }}
                      />
                    </td>
                    <td className={classes.quantityColumn}>{item.quantity}</td>
                    <td className={classes.priceColumn}>₹{item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className={classes.transactionFooter}>
              <div className={classes.total}>
                Total: ₹
                {transaction.movie_tv
                  .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                  .toFixed(2)}
              </div>
              <div className={classes.invoiceButton}>
                <PDFDownloadLink
                  document={<InvoicePDF transaction={transaction} />}
                  fileName={`invoice_order_${transaction.trans_id}.pdf`}
                >
                  {({ loading }) => (
                    loading ? 'Loading document...' : (
                      <>
                        Invoice <MdDownload />
                      </>
                    )
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Transactions;