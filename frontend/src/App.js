import './App.css';
import { useState, useEffect, useRef, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from '@mui/material/Stack';

function App() {

  const [name, setName] = useState("Stefan");
  const [surname, setSurname] = useState("Stefanowski");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#000000");
  const [checked, setChecked] = useReducer(checked => !checked, false);

  const tahoe_peaks = [
    { name: "freel", elevation: 10891 },
    { name: "monument", elevation: 1231 },
    { name: "pyramid", elevation: 999 },
    { name: "lastPyr", elevation: 1999 }
  ];

  function List({ data, renderItem, renderEmpty }) {
    return !data.length ? (
      renderEmpty) : (
      <ul>
        {data.map((item) => (
          <li key={item.name}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    alert(`${title}, ${color}`);
    setTitle("");
    setColor("#000000");

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
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          type="text"
          placeholder='color title...'

        />
        <input value={color} type="color" onChange={(event) => setColor(event.target.value)} />
        <button> ADD </button>
      </form>

      <input type="checkbox" value={checked} onChange={setChecked} />
      <label>
        {checked ? "checked" : "not checked"}
      </label>

      <List data={tahoe_peaks}
      renderEmpty={<p> This list is empty</p>}
      renderItem={(item) => (
        <>
        {item.name} - {item.elevation} ft.
        </>
      )} />
    </div>


  );

}

export default App;
