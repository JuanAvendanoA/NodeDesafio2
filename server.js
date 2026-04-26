const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000; // Puerto en el que el servidor escuchará

// Middleware para parsear el body como JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta GET para devolver las canciones
app.get("/canciones", (req, res) => {
  fs.readFile(path.join(__dirname, "repertorio.json"), "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");
    res.json(JSON.parse(data));
  });
});

// Ruta POST para agregar una canción
app.post("/canciones", (req, res) => {
  const newSong = req.body; // Los datos de la canción enviados desde el cliente

  fs.readFile(path.join(__dirname, "repertorio.json"), "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");

    const songs = JSON.parse(data);
    songs.push(newSong);

    fs.writeFile(
      path.join(__dirname, "repertorio.json"),
      JSON.stringify(songs, null, 2),
      (err) => {
        if (err) return res.status(500).send("Error al guardar la canción");
        res.status(201).send("Canción agregada");
      },
    );
  });
});

// Ruta PUT para actualizar una canción
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const updatedSong = req.body;

  fs.readFile(path.join(__dirname, "repertorio.json"), "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");

    const songs = JSON.parse(data);
    const songIndex = songs.findIndex((song) => song.id === id);

    if (songIndex === -1) return res.status(404).send("Canción no encontrada");

    songs[songIndex] = { ...songs[songIndex], ...updatedSong };

    fs.writeFile(
      path.join(__dirname, "repertorio.json"),
      JSON.stringify(songs, null, 2),
      (err) => {
        if (err) return res.status(500).send("Error al actualizar la canción");
        res.send("Canción actualizada");
      },
    );
  });
});

// Ruta DELETE para eliminar una canción
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(path.join(__dirname, "repertorio.json"), "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");

    let songs = JSON.parse(data);
    songs = songs.filter((song) => song.id !== id);

    fs.writeFile(
      path.join(__dirname, "repertorio.json"),
      JSON.stringify(songs, null, 2),
      (err) => {
        if (err) return res.status(500).send("Error al eliminar la canción");
        res.send("Canción eliminada");
      },
    );
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
