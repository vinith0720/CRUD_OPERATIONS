import express from "express";
var router = express.Router();
import jwt from "jsonwebtoken";

import connection from '../module/dbconnection.js';
import authorization,{secret} from "../jwt.js";
import { token } from "morgan";


router.post("/login", async (req,res) => {
  const {username,password} = req.body
  jwt.sign({username,password},secret,(err,token)=>{
    if(err){
      res.status(400).json({"err":err})
    }
    res.status(200).json({"token":token})
  })
});

/* GET users listing. */
router.get('/', authorization,function(req, res) {
  res.send('Express is working ..,');
});



router.get("/get",authorization, async (req, res) => {
  try {
    const [rows, fields] = await connection.promise().query("SELECT * FROM USER;");
    res.status(200).json({ data: rows });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});
    

router.get("/get/:id",authorization,async (req ,res)=> {
  try {

    const id = parseInt(req.params.id); 
    const [existingUser] = await connection.promise().query("SELECT * FROM USER WHERE id = ?", [id]);
    console.log(existingUser);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      user : existingUser
    })

  } catch (error) {
    res.status(500).json({ message: `Error updating user: ${error.message}` });
  }
});


router.post("/createuser", authorization,(req ,res) => {
  try{
        const {name , age  , role } = req.body
        if (!name && !age && !role) {
          throw new Error("Name and age and role are required");
        }
        connection.query("INSERT INTO user (name, age, role) VALUES (?, ?, ?)", [name,age,role],
          (err,result,fields) => {
            console.log(err,fields,result);
            
            if(err) {res.status(400).json({ERROR :err})}
            res.status(200).json({
              field : fields,
              results:result,
              msg:"user created..,"
            })
          });
        }
  catch(err){
    res.status(400).send(`user not created because ${err.message}`);
  }
});

router.put("/updateuser/:id",authorization, async (req, res) => {
  try {
    const { name, age } = req.body; 
    const id = parseInt(req.params.id); 

    const [existingUser] = await connection.promise().query("SELECT * FROM USER WHERE id = ?", [id]);
    console.log(existingUser.users);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [result] = await connection.promise().query("UPDATE USER SET name = ?, age = ? WHERE id = ?", [name, age, id]);

    if (result.affectedRows > 0) {
      res.status(200).json({
        message: "User updated successfully",
        updatedUser: { id, name, age },
      });
    } else {
      res.status(400).json({ message: "Failed to update user" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error updating user: ${error.message}` });
  }
});



router.delete("/deleteuser/:id",authorization, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result, fields] = await connection.promise().query(
      "DELETE FROM USER WHERE id = ?", [id] );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "User deleted successfully", fields });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: `Error deleting user: ${err.message}` });
  }
});



// module.exports = router;

export default router;
