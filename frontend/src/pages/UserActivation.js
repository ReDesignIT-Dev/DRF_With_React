import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { activateUser } from 'services/apiRequests';

const UserActivation = () => {
  const { token } = useParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const activate = async () => {
      try {
        const response = await activateUser(token);
        const returnMessage = response.data.message;
        if (response.status === 200) {
          setMessage(returnMessage);
        } else {
          setMessage("Failed to activate.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again.");
      }
    };

    activate();
  }, [token]);


return (
    <div className="container">
     {message}
    </div>
  );
};

export default UserActivation;