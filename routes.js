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
router.get('/user/:uid', async (req, res) => {
    const result = await db.one('SELECT * from users WHERE firebase_uid = $(uid)', {
        uid: req.params.uid
    });

    if (!result) {
        return res.status(404).send('The user could not be found');
    }

    res.json(result);
});

// get group by id for details
router.get('/group/:id', async (req, res) => {
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




module.exports = router;