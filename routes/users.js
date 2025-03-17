var express = require('express');
var router = express.Router();


var db = [
  {
      "id": 0,
      "name": "kumar",
      "age": 32
  },
  {
      "id": 1,
      "name": "kumar",
      "age": 32
  },
  {
      "id": 3,
      "name": "kumar",
      "age": 32
  }
];


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Express is working ..,');
});



router.get("/get",(req ,res)=> {

  try {
    res.status(200).json(db);
  }catch (err) {
    res.status(400).send(` Error getting user: ${err.message}`);
}

});

router.get("/get/:id",(req ,res)=> {

  try {
    const id = parseInt(req.params.id); 
    console.log(db.length , id);
    
    (db.length >= id) ? res.json(db[id]) : res.status(400).send("user not found") ;
} catch (err) {
    res.status(400).send(` Error getting user: ${err.message}`);
}

});


router.post("/createuser", (req ,res) => {
  try{
        const {name , age } = req.body
        if (!name && !age) {
          throw new Error("Name and age are required");
        }
        const user = { id : db.length , name : name , age : age}
        db.push(user) 
        res.status(200).send("user created ..,")
      }
  catch(err){
    res.status(400).send(`user not created because ${err.message}`);
  }
});

router.put("/updateuser/:id", (req, res) => {
  try {
      const { name, age } = req.body;
      const id = parseInt(req.params.id);

      const userIndex = db.findIndex(user => user.id === id);
      if (userIndex === -1) {
          return res.status(404).json({ message: "User not found" });
      }
      db[userIndex] = { ...db[userIndex], name, age };

      res.status(200).json({
          message: "User updated successfully",
          user: db[userIndex]
      });

  } catch (error) {
      res.status(400).json({ message: `User not updated: ${error.message}` });
  }
});



router.delete("/deleteuser/:id", (req, res) => {
  try {
      const id = parseInt(req.params.id); 
      const initialLength = db.length;
      console.log(id ,db, initialLength);
      
      db = db.filter(user => user.id !== id); 
      console.log(db)
      if (db.length < initialLength) {
          res.status(200).send(` User with id ${id} deleted successfully!`);
      } else {
          throw new Error(`User with id ${id} not found.`);
      }
  } catch (err) {
      res.status(400).send(` Error deleting user: ${err},${err.message}`);
  }
});



module.exports = router;
