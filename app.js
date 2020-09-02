const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const uniqueValidator = require("mongoose-unique-validator");
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://admin-saiteja:7PEfa.rqBi65PZs@cluster0.nqcml.mongodb.net/playersDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

mongoose.connection.once("open", function () {
  console.log("MongoDB database connection established successfully!");
});

const playersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  team: String,
  total_score: Number,
  total_matches: Number,
  scores: Array,
});
playersSchema.plugin(uniqueValidator);

const Red = mongoose.model("RedPlayer", playersSchema);
const Blue = mongoose.model("BluePlayer", playersSchema);

app.get("/:team", function (req, response) {
  const team = req.params.team;
  if (team === "red") {
    Red.find(function (err, res) {
      if (err) {
        response.send(err);
      } else {
        response.send(res);
      }
    });
  } else if (team === "blue") {
    Blue.find(function (err, res) {
      if (err) {
        response.send(err);
      } else {
        response.send(res);
      }
    });
  }
});

app.get("/:team/:id", function (req, response) {
  const team = req.params.team;
  const id = req.params.id;
  if (team === "red") {
    Red.findOne({ _id: id }, function (err, res) {
      if (err) {
        response.send(err);
      } else {
        response.send(res);
      }
    });
  } else if (team === "blue") {
    Blue.findOne({ _id: id }, function (err, res) {
      if (err) {
        response.send(err);
      } else {
        response.send(res);
      }
    });
  }
});

app.post("/:team", function (req, response) {
  const team = req.params.team;
  const playerData = req.body;
  if (team === "red") {
    const redPlayer = new Red({
      ...playerData,
    });
    redPlayer.save(function (err) {
      if (err) {
        response.send("Username is already present!");
      } else {
        response.send(
          "Successfully registered!, Now go and conquer the field!"
        );
      }
    });
  } else if (team === "blue") {
    const bluePlayer = new Blue({
      ...playerData,
    });
    bluePlayer.save(function (err) {
      if (err) {
        response.send("Username is already present!");
      } else {
        response.send(
          "Successfully registered!, Now go and conquer the field!"
        );
      }
    });
  }
});

app.put("/:team/:id", function (req, response) {
  const team = req.params.team;
  const id = req.params.id;
  const data = req.body;
  if (team === "red") {
    Red.updateOne({ _id: id }, { ...data }, function (err) {
      if (err) {
        console.log(err);
        response.send(err);
      } else {
        response.send("Updated successfully!");
      }
    });
  } else if (team === "blue") {
    Blue.updateOne({ _id: id }, { ...data }, function (err) {
      if (err) {
        console.log(err);
        response.send(err);
      } else {
        response.send("Updated successfully!");
      }
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
