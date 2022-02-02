const express = require("express")
const dotenv = require("dotenv")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./graphql/schema")
const fileUpload = require('express-fileupload');
const cors = require("cors")

const { connectDB } = require("./db")
const app = express()
dotenv.config()
connectDB()

const { authenticate } = require("./middleware/auth")

app.use(cors())
app.use(authenticate)
app.use(fileUpload());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome! Go to /graphql" })
})

app.use(
  "/graphql",
  graphqlHTTP((req)=>({
    schema,
    graphiql: true,
    context: req
  }))
)

app.post('/upload', async function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  };

  let image = req.files.image;
  let uploadPath = __dirname + '/images/' + image.name;

  image.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.status(200).json({ message: 'File uploaded!', path: uploadPath});
  });
});

app.listen(process.env.PORT, () => {
  console.log(`App running on PORT ${process.env.PORT}`)
})
