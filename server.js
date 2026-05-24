const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes);

<<<<<<< HEAD
// DATABASE

const db = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});


// CONNECT

db.connect((err) => {

    if(err){

        console.log(err);

        return;
    }

    console.log('MySQL Connected');

});

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT 1 + 1 AS solution');
        res.json(rows);
    } catch (err) {
        ress.status(500).json({ error: 'Database error' });
    }
});


// GET PATIENT

app.get('/api/patient/:id', (req, res) => {

    const idNumber = req.params.id;

    const sql =
        'SELECT * FROM patients WHERE id_number = ?';

    db.query(sql, [idNumber], (err, results) => {

        if(err){

            return res.status(500).json({

                success:false,
                message:'Database error'

            });

        }

        if(results.length === 0){

            return res.status(404).json({

                success:false,
                message:'Patient not found'

            });

        }

        res.json({

            success:true,
            patient:results[0]

        });

    });

});


// SERVER DOWN PAGE

app.use((req, res) => {

    res.status(404).send(`

        <h1>
            404 - Server Offline
        </h1>

    `);

});


// START

app.listen(process.env.PORT, () => {

    console.log(
        'Server running on port ' +
        process.env.PORT
    );

=======
app.listen(3000, () => {
  console.log('Server running');
>>>>>>> 74b73e3a678e5825974592c9808f7d526e9e1303
});