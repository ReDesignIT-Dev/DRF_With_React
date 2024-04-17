import { getData } from 'services/apiRequests';
import { useState, useEffect } from 'react';
import SignupSuccessfulPop from "../components/LoginForm/SignupSuccessfulPop";
export default function Home() {
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleTestClick = () => {
    // Update state to show the popup
    setShowPopup(true);
    // Set the message here if needed
    console.log("test 1");
  };

  return (
    <div>
      <h1> Main page </h1>
 
      <p>{message}</p>

      <h1>Welcome to Our Shop</h1>
          <button onClick={handleTestClick}>Test button</button>
      {showPopup && <SignupSuccessfulPop message={message} />}

    </div>
  );
}