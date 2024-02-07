import './App.css';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from '@mui/material/Stack';

function App() {

  const [name, setName] = useState("Stefan");
  const [surname, setSurname] = useState("Stefanowski");

  useEffect(() => {
    console.log(`Now it's ${name} & ${surname}`);
  }, [name, surname]);


  return (
    <div className="App">

      <h1> Now its the {name} {surname}</h1>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Button variant="primary" onClick={() => setName("Boguś")}>
          Boguś inside
        </Button>

        <Button onClick={() => setSurname("Wacławowski")}>
          Wacławowski inside
        </Button>
      </Stack>
    </div>

  );

}

export default App;
