import React from 'react';
import '../css/App.css';
import PropTypes from 'prop-types';

const Notification = ({ message, isError }) => {
    if (!message) {
      return null;
    }

    const notificationString = `notification ${isError ? 'error' : 'success'}`;

    return <div className={notificationString}>{message}</div>;
};
  
Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool
};


export default Notification;
  