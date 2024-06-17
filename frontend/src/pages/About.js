import { useEffect } from 'react';
import { getDataUsingUserToken } from "services/apiRequests";
import Cookies from 'js-cookie';

export default function About() {

  async function getSecrets() {
    try {
      const token = Cookies.get('token');
      await getDataUsingUserToken("secrets/", token).then((response) => {
        console.log("response: ", response);
        if (response.status === 200) {
          console.log("OK");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSecrets();
  }, []);

  return (
    <div>
      <h1> About this website </h1>
    </div>
  );
}