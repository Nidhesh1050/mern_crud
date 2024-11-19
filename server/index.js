const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./model/User');
const ImageModel = require('./model/ImageModel');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const secretKey = 'secretKey'; // Change this to a more secure key in a real app

// Middleware to verify JWT
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1]; // Bearer token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = decoded; // Save decoded user information to request
            next();
        });
    } else {
        res.sendStatus(403); // Forbidden
    }
}

app.get("/", verifyToken,(req, res) => {
    UserModel.find({})
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

app.post("/createUser", (req, res) => {
    const newUser = new UserModel(req.body);
    newUser.save()
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// User login route
app.post("/login", (req, res) => {

   // console.log(req.body); return false;

    const { email, name } = req.body; // Assuming password is in the body
    UserModel.findOne({ email, name }) // You should hash passwords in a real app
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '300s' });
            res.json({ token });
        })
        .catch(err => res.json(err));
});


app.get("/getUser/:id",(req, res) => {
    const id = req.params.id;
    UserModel.findById({ _id: id })
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

app.put("/updateUser/:id",(req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndUpdate({ _id: id }, {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    }, { new: true })
        .then(user => {
            const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '300s' });
            res.json({ user, token });
        })
        .catch(err => res.json(err));
});

app.delete("/deleteUser/:id",(req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete({ _id: id })
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// ---------------------------File Upload Code-----------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: false }));

app.post('/uploadImage', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or field name is incorrect.' });
    }

    const newImage = new ImageModel({ imageUrl: req.file.path });
    newImage.save()
        .then(image => res.json(image))
        .catch(err => res.status(500).json(err));
});
// ---------------------------File Upload Code End-----------------------------

mongoose.connect('mongodb://localhost:27017/mydatabase')
    .then(() => {
        app.listen(3001, () => {
            console.log('Node API app is running on port 3001 by Nidhesh');
        });

        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });