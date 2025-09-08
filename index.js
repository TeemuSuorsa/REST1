let dictionary = [];
const express = require("express");
const fs = require("fs");
const PORT = 3000;

//const bodyParser = require("body-parser");
/* const app = express().use(bodyParser.json()); //vanha tapa - ei enÃ¤Ã¤ voimassa. 
kts. https://devdocs.io/express/ -> req.body*/
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

/*CORS isnâ€™t enabled on the server, this is due to security reasons by default,
so no one else but the webserver itself can make requests to the server.*/
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader("Content-type", "application/json");

  // Pass to next layer of middleware
  next();
});

app.get("/haku", (req, res) => {
  const hakusana = req.query.suomi?.toLowerCase();
  if (!hakusana) {
    return res.status(400).json({ virhe: "Anna parametriksi ?suomi=..." });
  }

  // Luetaan tiedosto ilman try-catchia (virhe kaataa prosessin)
  const data = fs.readFileSync("./sanakirja.txt", { encoding: "utf8" });
  console.log(data); // debuggaus

  const splitLines = data.split(/\r?\n/);

  for (const line of splitLines) {
    const [fin, eng] = line.trim().split(/\s+/); // poistaa ylimääräiset välilyönnit/tabit
    if (fin === hakusana) {
      return res.json({ suomi: fin, englanti: eng });
    }
  }

  res.status(404).json({ virhe: "Sanaa ei löytynyt" });
});

app.post("/lisaa", (req, res) => {
  const { fin, eng } = req.body;

  if (!fin || !eng) {
    return res
      .status(400)
      .json({ virhe: "Anna sekä suomenkielinen että englanninkielinen sana" });
  }

  // Luetaan vanha sisältö
  let data = fs.readFileSync("./sanakirja.txt", { encoding: "utf8" });
  if (data && !data.endsWith("\n")) {
    data += "\n"; // varmistetaan että viimeisen rivin jälkeen on rivinvaihto
  }

  // Lisätään uusi rivi
  data += `${fin}\t${eng}\n`;

  // Kirjoitetaan koko tiedosto uudelleen
  fs.writeFileSync("./sanakirja.txt", data, { encoding: "utf8" });

  res.json({ viesti: "Sana lisätty onnistuneesti", suomi: fin, englanti: eng });
});

app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});
