import './App.css';
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from '@mui/material/Stack';

function App() {

  const [name, setName] = useState("Stefan");
  const [surname, setSurname] = useState("Stefanowski");
  const txtTitle = useRef();
  const hexColor = useRef();

  console.log(txtTitle);
  const submit = (e) => {
    e.preventDefault();
    const title = txtTitle.current.value;
    const color = hexColor.current.value;
    alert(`${title}, ${color}`);
    txtTitle.current.value = "";
    hexColor.current.value = "";
  }

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

    <form onSubmit={submit}>
      <input 
      ref={txtTitle}
      type = "text"
      placeholder='color title...'
      />
      <input ref={hexColor} type="color" />
      <button> ADD </button>
    </form>

    </div>

  );

}

export default App;
