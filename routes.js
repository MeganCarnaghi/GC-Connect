const express = require('express');
const pgp = require('pg-promise')();
const router = express.Router();

router.use(express.json());

// *** Database here
const db = pgp({
    database: 'gc-connect' 
});

// get all users for phonebook list
router.get('/users', async (req, res) => {
    res.json(await db.many('SELECT * from users'));
});

// get all groups for group list
router.get('/groups', async (req, res) => {
    res.json(await db.many('SELECT * from groups'));
});

// get user by id for profile/popup
router.get('/users/:uid', async (req, res) => {
    const result = await db.one('SELECT * from users WHERE firebase_uid = $(uid)', {
        uid: req.params.uid
    });

    if (!result) {
        return res.status(404).send('The user could not be found');
    }

    res.json(result);
});

// get group by id for details
router.get('/groups/:id', async (req, res) => {
    const result = await db.one('SELECT * from groups WHERE id = $(id)', {
        id: req.params.id
    });

    if (!result) {
        return res.status(404).send('The group could not be found');
    }

    res.json(result);
});

// get group-posts by group
router.get('/group-posts/:id', async (req, res) => {
    const result = await db.many('SELECT * from group_posts WHERE group_id = $(id)', {
        id: req.params.id
    });

    if (!result) {
        return res.status(404).send('The group could not be found');
    }

    res.json(result);
});

// get group-members by group
router.get('/group-members/:id', async (req, res) => {
    const result = await db.many('SELECT user_id from group_members WHERE group_id = $(id)', {
        id: req.params.id
    });

    if (!result) {
        return res.status(404).send('The group could not be found');
    }

    res.json(result);
});

// get all users for phonebook list
router.post('/users', async (req, res) => {
    try{

        await db.none('INSERT INTO users (firebase_uid, email, first_name, last_name, type, bootcamp, authorized) VALUES ($(firebase_uid), $(email), $(first_name), $(last_name), $(type), $(bootcamp), $(authorized))', {
            firebase_uid: req.body.firebase_uid,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            type: req.body.type,
            bootcamp: req.body.bootcamp,
            authorized: req.body.authorized
        });

        const user = await db.one('SELECT email FROM users WHERE email = $(email)', {
            email: req.body.email
        });

        res.status(201).json(user);

    } catch (error) {
        // if (error.constraint === 'users_pkey'){
        //     return res.status(400).send('The state already exists');
        // }
        console.log(error);
        res.status(500).send(error);
    }

});

// update a user record with the firebase UID when person signs up
router.put('/users/:email', async (req, res) => {

    try{
        const user = await db.oneOrNone('SELECT email FROM users WHERE email = $(email)', {
            email: req.params.email
        });

        console.log(user);

        if (!user){
            return res.status(404).send('User email does not exist.')
        }

        await db.oneOrNone('UPDATE users SET firebase_uid = $(firebase_uid) WHERE email = $(email)', {
            email: req.params.email,
            firebase_uid: req.body.firebase_uid,
        });

        const updatedUser = await db.one('SELECT email, firebase_uid FROM users WHERE email = $(email)', {
            email: req.params.email
        });

        res.status(201).json(updatedUser);

    } catch (error) {
        
        console.log(error);
        res.status(500).send(error);
    }
    
});


module.exports = router;