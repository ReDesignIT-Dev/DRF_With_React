import React from 'react';
import { useParams } from 'react-router-dom';

const UserActivation = () => {
  const { token } = useParams();

// TODO LOGIC
return (
    <div className="container">
     {token}
    </div>
  );
};

export default UserActivation;