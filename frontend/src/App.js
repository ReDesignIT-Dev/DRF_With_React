import './App.css';
import { useState, useEffect, useRef, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from '@mui/material/Stack';
import {Link, Outlet} from "react-router-dom";
import axios from 'axios';

function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <h1> Home website </h1>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/about"> About </Link>
      </nav>
      <p>{message}</p>
    </div>
  );
}

export function About() {
  return (
    <div>
      <h1> About this website </h1>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/about"> About </Link>
        <Link to="/about/history"> History </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export function Contact() {
  return (
    <div>
      <h1> Contact form for the website </h1>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/about"> About </Link>
      </nav>
    </div>
  );
}

export function History() {
  return (
    <div>
      <h1> History of this page </h1>
    </div>
  );
}

export function App(){
  return <Home />;
}

function Training() {

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
