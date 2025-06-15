require('dotenv').config();
const express = require('express');
const app = express();
const carRoutes = require('./routes/carRoutes');
const partRoutes = require('./routes/partRoutes');

app.use(express.json());

app.get('/', (req, res) => res.send('autoCat API running'));

app.use('/cars', carRoutes);
app.use('/parts', partRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`autoCat backend listening on port ${PORT}`);
});
// Get all parts
app.get('/parts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM parts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch parts');
  }
});

// Get all parts for a specific car
app.get('/cars/:carId/parts', async (req, res) => {
  const { carId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM parts WHERE car_id = $1', [carId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch parts for this car');
  }
});

// Add a new part
app.post('/parts', async (req, res) => {
  const { car_id, name, category, stock, price } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO parts (car_id, name, category, stock, price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [car_id, name, category, stock, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).send('Failed to add part');
  }
});

// Delete a part
app.delete('/parts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM parts WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Part not found');
    }
    res.json({ message: 'Part deleted', part: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to delete part');
  }
});
