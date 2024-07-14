import { FRONTEND_LOGIN_URL } from 'config';
import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activateUser } from 'services/apiRequests';
import Loading from "components/Loading";

const UserActivation = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    
    const activate = async () => {
      if (token && !success) {
        setLoading(true);
      try {
        const response = await activateUser(token);
        if (response.status === 200) {
          setSuccess(true);
          
          navigate(FRONTEND_LOGIN_URL, {replace: true});
        } else {
          setMessage("Failed to activate.");
        }
      } catch (error) {
        setMessage("An error occurred. Contact administrator.");
      }
      finally {
        setLoading(false);
      }
    }
    };

    activate();
  }, [token]);


return (
    <div className="d-flex justify-content-center align-items-center">
     {loading ? (
        <Loading />
      ) : (<h2>{message}</h2>)}
    </div>
  );
};

export default UserActivation;