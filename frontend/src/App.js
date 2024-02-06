import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const [name, setName] = useState("Stefan");
  const [surname, setSurname] = useState("Stefanowski");

  useEffect(() => {
    console.log(`Now it's ${name} & ${surname}`);
  }, [name, surname]);


  return (
    <div className="App">

      <h1> Now its the {name} {surname}</h1>
      <button onClick={() => setName("Boguś")}>
        Boguś inside
      </button>
      
      <button onClick={() => setSurname("Wacławowski")}>
        Wacławowski inside
      </button>
    </div>

  );

}

export default App;
