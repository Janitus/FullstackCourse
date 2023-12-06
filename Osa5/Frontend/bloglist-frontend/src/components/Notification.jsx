import React from 'react';
import '../css/App.css';

const Notification = ({ message, isError }) => {
    if (!message) {
      return null;
    }

    const notificationString = `notification ${isError ? 'error' : 'success'}`;

    return <div className={notificationString}>{message}</div>;
  };
  
  export default Notification;
  