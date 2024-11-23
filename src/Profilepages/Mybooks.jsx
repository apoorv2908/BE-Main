import React, { useState, useEffect } from 'react';

const Mybooks = ({ userId }) => {
  const [booksData, setBooksData] = useState(null);

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/books`);
        const data = await response.json();
        setBooksData(data);
      } catch (error) {
        console.error('Error fetching books data:', error);
      }
    };

    fetchBooksData();
  }, [userId]);

  return (
    <div>
      <h3>Your Books</h3>
      {booksData ? (
        <ul>
          {booksData.map((book, index) => (
            <li key={index}>{book}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Mybooks;
