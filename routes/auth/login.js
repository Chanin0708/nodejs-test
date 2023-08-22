require('dotenv').config();
require('../../config/database').connect();

const express = require('express');
const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const router = express.Router();

router.post("/auth/login", async (req, res) =>{
    try{

        const { email, password } = req.body;

        if (!(email && password )) {
            res.status(400).send("All input is required")
        }


        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {

            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )
            user.token = token
            res.status(200).json(user)
        }

        res.status(400).send("Invalid Credentials")

    } catch (error){
        console.log(err)
    }
    
})
module.exports = router