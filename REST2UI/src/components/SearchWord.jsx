import React, { useState } from "react";

function SearchWord() {
  const [fin, setFin] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setResult("");
    setMessage("");

    try {
      const response = await fetch(`http://localhost:3000/haku?suomi=${fin}`);

      const data = await response.json();

      if (response.ok) {
        setResult(`Suomeksi: ${data.suomi} - Englanniksi: ${data.englanti}`);
        //setFin("");
      } else {
        setMessage(data.virhe || "Sanaa ei löytynyt");
      }
    } catch {
      setMessage("Virhe");
    }
  }

  return (
    <div>
      <h2>Hae sana</h2>
      <form onSubmit={handleSearch}>
        <label>Suomeksi: </label>
        <input
          type="text"
          value={fin}
          onChange={function (e) {
            setFin(e.target.value);
          }}
          required
        />
        <button type="submit">Hae</button>
      </form>
      {result && <p>{result}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default SearchWord;
