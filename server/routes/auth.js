const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login de administrador con credenciales en variables de entorno
// La ruta es /api/auth/login - se mantendrá oculta al público
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

module.exports = router;
