const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');

// Listar todos os hospitais exceto o logado (se for hospital) ou todos (se for user comum)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let where = {};
    // Se o usuário logado for hospital, não mostrar ele mesmo
    if (req.user && req.user.tipo === 'hospital') {
      where = { id: { [Op.ne]: req.user.id } };
    }
    const hospitals = await Hospital.findAll({
      where,
      attributes: ['id', 'nome', 'email', 'endereco', 'telefone']
    });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    console.error('Erro ao buscar hospitais:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar hospitais' });
  }
});

module.exports = router;
