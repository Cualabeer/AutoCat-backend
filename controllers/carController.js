const pool = require('../db');

exports.getAllCars = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to get cars');
  }
};

exports.addCar = async (req, res) => {
  const { make, model, year, vin, mileage, color } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cars (make, model, year, vin, mileage, color)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [make, model, year, vin, mileage, color]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).send('Failed to add car');
  }
};
