import { useState, useEffect } from 'react';
import './SignupSuccessfulPop.scss'; // You can create a CSS file for styling

const SignupSuccessfulPop = ({ message }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000); // Change the duration as per your requirement (3 seconds in this example)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`popup ${show ? 'show' : ''}`}>
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SignupSuccessfulPop;