const express = require("express");
const knex = require("knex");

// database access using knex
// const db = require('../data/db-config.js');

const dbConnection = knex({
  //configuration object
  client: "sqlite3",
  connection: {
    //how to find the database
    filename: "./data/posts.db3"
    //ust the path from the root of the app/folder
  },
  useNullAsDefault: true
});

const router = express.Router();

// USING THE WHERE() METHOD WILL ALWAYS SEND BACK AN ARRAY,
// USE A .FIRST() TO AVOID THIS

router.get("/", (req, res) => {
  //use knex to get the data from the database
  // dbConnection.select('*').from('posts')
  // SAME as ^^
  dbConnection("posts")
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  dbConnection("posts")
    .where({ id: id })
    .first()
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "NOT FOUND" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/", (req, res) => {
  const post = req.body;

  dbConnection("posts")
    .insert(post)
    .then(ids => {
      const id = ids[0];

      res.status(201).json(id);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;

  dbConnection("posts")
    .where({ id: id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} record(s) updated` });
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  dbConnection("posts")
    .where({ id: id })
    .del()
    .then(count => {
      res.status(201).json({ message: `${count} record(s) deleted` });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
