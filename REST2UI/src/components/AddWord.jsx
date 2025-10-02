import React, { useState } from "react";

function AddWord() {
  const [fin, setFin] = useState("");
  const [eng, setEng] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/lisaa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fin, eng }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Sana lisätty: ${data.suomi} - ${data.englanti}`);
        setFin("");
        setEng("");
      } else {
        setMessage(data.virhe || "Virhe lisättäessä sanaa");
      }
    } catch {
      setMessage("Virhe palvelinyhteydessä");
    }
  };

  return (
    <div>
      <h2>Lisää uusi sana</h2>
      <h3>Sanan täytyy alkaa pienellä kirjaimella</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Suomeksi: </label>
          <input
            type="text"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Englanniksi: </label>
          <input
            type="text"
            value={eng}
            onChange={(e) => setEng(e.target.value)}
            required
          />
        </div>
        <button type="submit">Lisää</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddWord;
