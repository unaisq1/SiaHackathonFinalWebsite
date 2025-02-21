/* Import dependencies */
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import { } from 'module';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import DatabaseService from './services/database.service.mjs';

/* Create express instance */
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* Add form data middleware */
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.get('*.js', function (req, res) {
	res.type('application/javascript');
	res.sendFile('/services/actions.js', {root: __dirname});
	// console.log(`req.url: ${req.url}`);
	// console.log(`__dirname: ${__dirname}`);
});

// Integrate Pug with Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
/* Add form data middleware */
app.use(express.urlencoded({extended: true}));

app.use(
	session({
		secret: 'verysecretkey',
		resave: false,
		saveUninitialized: true,
		cookie: {secure: false},
	}),
);

// Integrate Pug with Express
app.set('view engine', 'pug');

// Serve assets from 'static' folder
app.use(express.static('static'));

const db = await DatabaseService.connect();
const {conn} = db;

// Landing route
app.get('/', (req, res) => {
	res.render('login');
});

// Landing route
app.get('/admin?delete:name', (req, res) => {
	console.log(reg.params.name);

	deleteIt(reg.params.name);
});

// Login route
app.get('/index', (req, res) => {
	res.render('index');
});

// Login route
app.get('/login', (req, res) => {
	res.render('login');
});


// Run server!
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});


app.use(express.json());

app.post('/login', async (req, res) => {
	console.log('Login route hit'); // Add this line
    const { email, password } = req.body;
    const dbService = await DatabaseService.connect();
    const isLoggedIn = await dbService.Login(email, password);

    if (isLoggedIn) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/signup', async (req, res) => {
    console.log('Signup route hit');
    const { email, confirmPassword } = req.body;

    try {
        const dbService = await DatabaseService.connect();
        const addedUser = await dbService.add_User(email, confirmPassword);

        if (addedUser) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
        console.log('succesully created account')
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ success: false, error: 'Sign-up failed' });
    }
});

app.get('/api/tokens', async (req, res) => {
    try {
		const email = req.cookies.userEmail;  // Access the email from cookies
		const db = await DatabaseService.connect();
        const tokens = await db.Get_tokens(email);
		const tokenCount = tokens.length > 0 ? tokens[0].tokens : 0;
        res.json({ tokens: tokenCount });
    } catch (err) {
        console.error('Error fetching tokens:', err);
        res.status(500).json({ error: 'Unable to fetch token balance' });
    }
});

app.post('/deductBalance', async (req, res) => {
    try {
        const email = req.cookies.userEmail;
        const { deduction } = req.body; // Ensure that 'deduction' is extracted properly
        const db = await DatabaseService.connect();
        
        const tokens = await db.rm_tokens(deduction, email); // Deduct tokens

        if (tokens.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error('Error subtracting tokens:', err);
        res.status(500).json({ error: 'Unable to subtract tokens' });
    }
});

app.post('/addToBalance', async (req, res) => {
    try {
        const email = req.cookies.userEmail;
        const { amount } = req.body; // Ensure that 'amount' is extracted properly
        const db = await DatabaseService.connect();
        
        const tokens = await db.Add_Dev_tokens(email); // Add tokens

        if (tokens.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error('Error adding tokens:', err);
        res.status(500).json({ error: 'Unable to add tokens' });
    }
});