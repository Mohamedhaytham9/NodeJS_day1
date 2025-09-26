const express=require('express')
const app=express();
const query=require('./db');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const port =3000;
app.use(express.json());
const JWT_SECRET = 'JWT_Test_Key'


const regValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(13).max(120).required()
});
const LogValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};





app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

app.get('/users', async (req, res) => {
  try {
    const users = await query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/users',async(req,res)=>{
try{
   const { error } = regValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
   const { name, email, password, age } = req.body;
   const hashedPassword = await bcrypt.hash(password, 10);
   const result = await query(
      'INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, age]
    );

res.json({message:'new user create'})
}
catch (err) {
    console.error('DB error:', err);
        res.status(500).json({ error: err.message  });
}


});

app.post('/login',async(req,res)=>{
try{
   const { error } = LogValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
   const { email, password } = req.body;
 const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }


});


app.get('/profile', auth, async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, age, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);

  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



