const express = require('express');
const fs = require('fs'); // Asegúrate de importar el módulo fs
const path = require('path');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'productos.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo JSON:', err);
      return res.status(500).json({ message: 'Error al leer el archivo JSON' });
    }
    try {
      const productos = JSON.parse(data);
      res.json(productos);
    } catch (parseError) {
      console.error('Error al parsear el JSON:', parseError);
      res.status(500).json({ message: 'Error al parsear el JSON' });
    }
  });
});

// Ruta para obtener productos por categoría
app.get('/productos/:categoria', (req, res) => {
  const categoria = req.params.categoria;
  const filePath = path.join(__dirname, 'public', 'productos.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo JSON:', err);
      return res.status(500).json({ message: 'Error al leer el archivo JSON' });
    }
    try {
      const productos = JSON.parse(data);
      const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
      res.json(productosFiltrados);
    } catch (parseError) {
      console.error('Error al parsear el JSON:', parseError);
      res.status(500).json({ message: 'Error al parsear el JSON' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
