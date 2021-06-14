const express = require("express");
const pgp = require("pg-promise")();
const router = express.Router();

require("dotenv").config();
router.use(express.json());

// *** Database here
const db = pgp({
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	database: process.env.PGDATABASE,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	ssl: {
		rejectUnauthorized: false,
	},
	max: process.env.PGMAX,
});

// get all users for phonebook list
router.get("/users", async (req, res) => {
	res.json(
		await db.many(
			"SELECT * from users WHERE authorized = true AND firebase_uid != 'UID' ORDER BY last_name"
		)
	);
});

// get all groups for group list
router.get("/groups", async (req, res) => {
	res.json(await db.many("SELECT * from groups"));
});

// get user by id for profile/popup
router.get("/users/:uid", async (req, res) => {
	const result = await db.one(
		"SELECT * from users WHERE firebase_uid = $(uid)",
		{
			uid: req.params.uid,
		}
	);

	if (!result) {
		return res.status(404).send("The user could not be found");
	}

	res.json(result);
});

// get group by id for details
router.get("/groups/:id", async (req, res) => {
	const result = await db.one("SELECT * from groups WHERE id = $(id)", {
		id: req.params.id,
	});

	if (!result) {
		return res.status(404).send("The group could not be found");
	}

	res.json(result);
});

// get group-posts by group with user id name & photo
router.get("/group-posts/:id", async (req, res) => {
	const result = await db.many(
		"SELECT gp.id, gp.group_id, gp.date, gp.user_id, gp.body, u.first_name, u.last_name, u.photo FROM group_posts gp INNER JOIN users u ON u.id = gp.user_id WHERE gp.group_id = $(id) ORDER BY date DESC",
		{
			id: req.params.id,
		}
	);

	if (!result) {
		return res.status(404).send("The group could not be found");
	}

	res.json(result);
});

// get group-members by group
router.get("/group-members/:id", async (req, res) => {
	const result = await db.many(
		"SELECT user_id from group_members WHERE group_id = $(id)",
		{
			id: req.params.id,
		}
	);

	if (!result) {
		return res.status(404).send("The group could not be found");
	}

	res.json(result);
});

// get list of groups that user is apart of
router.get("/groups-joined-by-user/:uid", async (req, res) => {
	const userId = await db.oneOrNone(
		"SELECT id FROM users WHERE firebase_uid = $(uid)",
		{
			uid: req.params.uid,
		}
	);

	if (!userId) {
		return res.status(404).send("The user could not be found");
	}

	const groupList = await db.many(
		"SELECT group_id from group_members WHERE user_id = $(id)",
		{
			id: userId.id,
		}
	);

	if (!groupList) {
		let emptyArray = [];
		return res.json(emptyArray).send("The user is not in any groups");
	}

	res.json(groupList);
});

// create a new user
router.post("/users", async (req, res) => {
	try {
		const user = await db.oneOrNone(
			"SELECT email FROM users WHERE email = $(email)",
			{
				email: req.body.email,
			}
		);

		if (user) {
			return res.status(404).send("User email already exists.");
		}

		await db.none(
			"INSERT INTO users (firebase_uid, email, first_name, last_name, type, bootcamp, authorized) VALUES ($(firebase_uid), $(email), $(first_name), $(last_name), $(type), $(bootcamp), $(authorized))",
			{
				firebase_uid: req.body.firebase_uid,
				email: req.body.email,
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				type: req.body.type,
				bootcamp: req.body.bootcamp,
				authorized: req.body.authorized,
			}
		);

		const newUser = await db.one(
			"SELECT email FROM users WHERE email = $(email)",
			{
				email: req.body.email,
			}
		);

		res.status(201).json(newUser);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

// update a user record with the firebase UID when person signs up
router.put("/users/:email", async (req, res) => {
	try {
		const user = await db.oneOrNone(
			"SELECT email FROM users WHERE email = $(email)",
			{
				email: req.params.email,
			}
		);

		if (!user) {
			return res.status(404).send("User email does not exist.");
		}

		await db.oneOrNone(
			"UPDATE users SET firebase_uid = $(firebase_uid) WHERE email = $(email)",
			{
				email: req.params.email,
				firebase_uid: req.body.firebase_uid,
			}
		);

		const updatedUser = await db.one(
			"SELECT email, firebase_uid FROM users WHERE email = $(email)",
			{
				email: req.params.email,
			}
		);

		res.status(201).json(updatedUser);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//add a user to a group (join button)
router.post("/group-members", async (req, res) => {
	try {
		const ins = await db.oneOrNone(
			"INSERT INTO group-members (group_id, user_id) VALUES ($(group_id), $(user_id)) RETURNING id",
			{
				group_id: req.body.group_id,
				user_id: req.body.user_id,
			}
		);

		const groupMember = await db.one(
			"SELECT * FROM group-members WHERE id = $(id)",
			{
				id: ins.id,
			}
		);

		res.status(201).json(groupMember);
	} catch (error) {
		// if (error.constraint === 'users_pkey'){
		//     return res.status(400).send('The state already exists');
		// }
		console.log(error);
		res.status(500).send(error);
	}
});

//add a comment to a group
router.post("/group-posts", async (req, res) => {
	try {
		const user = await db.oneOrNone(
			"SELECT id FROM users WHERE firebase_uid = $(uid)",
			{
				uid: req.body.uid,
			}
		);

		const ins = await db.oneOrNone(
			"INSERT INTO group_posts (group_id, user_id, body) VALUES ($(group_id), $(user_id),$(comment)) RETURNING id",
			{
				group_id: req.body.group_id,
				user_id: user.id,
				comment: req.body.comment,
			}
		);

		const groupPost = await db.one(
			"SELECT * FROM group_posts WHERE id = $(id)",
			{
				id: ins.id,
			}
		);

		res.status(201).json(groupPost);
	} catch (error) {
		// if (error.constraint === 'users_pkey'){
		//     return res.status(400).send('The state already exists');
		// }
		console.log(error);
		res.status(500).send(error);
	}
});

// update a user based on profile input values
router.put("/users-profile/:id", async (req, res) => {
	try {
		const user = await db.oneOrNone(
			"SELECT * FROM users WHERE id = $(id)",
			{
				id: req.params.id,
			}
		);

		if (!user) {
			return res.status(404).send("User does not exist.");
		}

		await db.oneOrNone(
			"UPDATE users SET photo = $(photo), first_name = $(first_name), last_name = $(last_name), bio = $(bio), bootcamp = $(bootcamp), linked_in = $(linked_in), github = $(github), calendly = $(calendly) WHERE id = $(id)",
			{
				id: req.params.id,
				photo: req.body.photo,
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				bio: req.body.bio,
				bootcamp: req.body.bootcamp,
				linked_in: req.body.linked_in,
				github: req.body.github,
				calendly: req.body.calendly,
			}
		);

		const updatedUser = await db.one(
			"SELECT * FROM users WHERE id = $(id)",
			{
				id: req.params.id,
			}
		);

		res.status(201).json(updatedUser);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
