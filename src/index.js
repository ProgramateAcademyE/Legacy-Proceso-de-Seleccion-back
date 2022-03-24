require("dotenv").config({path: "./.env"});
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const allRoutes = require("./routes");
const multer = require("multer");
const mimeTypes = require("mime-types");


// UPLOAD FILE PDF
const storage = multer.diskStorage({ //diskStorage is to saved in the computer
	destination: "uploads/", //Place where the files are saved
	filename: function (req, file, cb) { //req is the request's information, file is the file which is uploading and cd is a callback that is called when the function end
		cb(
			"",
			Date.now() + file.originalname + "." + mimeTypes.extension(file.mimetype),
		);	
	},
});
const upload = multer({
	storage: storage,
});

// Conection MongoDB
require("./db/mongo");

// Init Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("../client/build"));
app.use(allRoutes);


app.get("/",(req,res)=>{
	res.sendFile(__dirname + "/views/index.html");
})

app.post("/files",upload.single("avatar"),(req,res)=>{
	res.send('Todo bien');
})

// Setting
const port = process.env.PORT || 3001;
app.set("port", port);

// Init Server
app.listen(app.get("port"), (error) => {
    if (error) {
        console.error("Error connecting the server");
    } else {
        console.log(`Server running on port: ${port}`);
    }
});

module.exports = app;



// require("dotenv").config({path: "./.env"});
// const express = require("express");
// const morgan = require("morgan");
// const cors = require("cors");
// const allRoutes = require("./routes");

// // Conection MongoDB
// require("./db/mongo");

// // Init Express
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));
// app.use(express.static("../client/build"));
// app.use(allRoutes);

// // Setting
// const port = process.env.PORT || 3001;
// app.set("port", port);

// // Init Server
// app.listen(app.get("port"), (error) => {
//     console.log('conexion')
//     if (error) {
//         console.error("jeje Error connecting the server");
//     } else {
//         console.log(`Server running on port: ${port}`);
//     }
// });

// module.exports = app;
