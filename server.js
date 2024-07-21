/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Amit Kumar, Student ID: 160904231, Date: 19 July 2024

********************************************************************************/

const express = require("express"); // Import Express.js library
const path = require("path"); // Import path module for file path operations
const exphbs = require('express-handlebars'); // Import express-handlebars module
const collegeData = require("./module/collegeData.js"); // Import custom module for handling college data

const app = express(); // Initialize the Express application
const PORT = process.env.PORT || 8080; // Define the port to use, default to 8080 if not specified

app.use(express.static('public')); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies

// Set up Handlebars as the view engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

// Define routes

// Define Route to serve the home page
app.get("/", (req, res) => {
    res.render("home"); // Render the home.hbs view
});

// Define Route to serve the about page
app.get("/about", (req, res) => {
    res.render("about"); // Render the about.hbs view
});

// Route to serve the HTML demo page
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo"); // Render the htmlDemo.hbs view
});

// Route to retrieve students based on course query
app.get("/students", async (req, res) => {
    try {
        const students = req.query.course 
            ? await collegeData.getStudentsByCourse(req.query.course) 
            : await collegeData.getAllStudents();
        res.json(students); // Respond with JSON data of students
    } catch (err) {
        res.status(500).json({ message: "Error retrieving students" }); // Handle errors with a message
    }
});

// Route to retrieve teaching assistants
app.get("/tas", async (req, res) => {
    try {
        const tas = await collegeData.getTAs();
        res.json(tas); // Respond with JSON data of TAs
    } catch (err) {
        res.status(500).json({ message: "Error retrieving teaching assistants" }); // Handle errors with a message
    }
});

// Route to retrieve courses
app.get("/courses", async (req, res) => {
    try {
        const courses = await collegeData.getCourses();
        res.json(courses); // Respond with JSON data of courses
    } catch (err) {
        res.status(500).json({ message: "Error retrieving courses" }); // Handle errors with a message
    }
});

// Route to retrieve a specific student by student number
app.get("/student/:num", async (req, res) => {
    try {
        const student = await collegeData.getStudentByNum(req.params.num);
        res.json(student); // Respond with JSON data of the student
    } catch (err) {
        res.status(500).json({ message: "Error retrieving student" }); // Handle errors with a message
    }
});

// Route to serve the Add Student page
app.get("/addStudent", (req, res) => {
    res.render("addStudent"); // Render the addStudent.hbs view
});

// Route to handle form submission for adding a new student
app.post("/students/add", async (req, res) => {
    try {
        await collegeData.addStudent(req.body); // Assume you have an addStudent function in collegeData.js
        res.redirect("/students"); // Redirect to the students page after adding a student
    } catch (err) {
        res.status(500).json({ message: "Error adding student" }); // Handle errors with a message
    }
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).send("404 Not Found"); // Send a 404 error message
});

// Start the server
collegeData.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`); // Log server startup message
        });
    })
    .catch(err => {
        console.error(`Failed to initialize data: ${err}`); // Log initialization error
    });
