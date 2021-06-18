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

// *** GET ROUTES ***

// getAllUsers() : gets all users for directory
router.get("/users", async (req, res) => {
	res.json(
		await db.many(
			"SELECT * from users WHERE authorized = true AND firebase_uid != 'UID' ORDER BY last_name"
		)
	);
});

//  getUserByUid(uid) : gets user by uid for profile/popup
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

// getUserById(id) : gets user by id for profile/popup
router.get("/users-id/:id", async (req, res) => {
	const result = await db.one(
		"SELECT * from users WHERE id = $(id)",
		{
			id: req.params.id,
		}
	);

	if (!result) {
		return res.status(404).send("The user could not be found");
	}

	res.json(result);
});

// getAllGroups() : get all groups for group list
router.get("/groups", async (req, res) => {
	res.json(await db.many("SELECT * from groups"));
});

// getGroupById(id) : get group by id for details
router.get("/groups/:id", async (req, res) => {
	const result = await db.one("SELECT * from groups WHERE id = $(id)", {
		id: req.params.id,
	});

	if (!result) {
		return res.status(404).send("The group could not be found");
	}

	res.json(result);
});

// getAllGroupsWithUserJoinInfo(uid) : get all groups with user member info
router.get("/groups-joined/:uid", async (req, res) => {
try{
	const userId = await db.one(
		"SELECT id from users WHERE firebase_uid = $(uid)",
		{
			uid: req.params.uid,
		}
	);

	if (!userId) {
		return res.status(404).send("The user could not be found");
	}

	const groups = await db.manyOrNone("SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(id)",
		{
			id: userId.id
		}
	);

	if (!groups) {
		return res.status(404).send("There are no groups.");
	}

	res.status(200).json(groups);

} catch(error) {
	console.log(error);
	res.status(500).send(error);
}
	
});

// getGroupByIdAndUserJoin(groupId, uid) : get specific group by group ID with user ID if member
router.get("/group-details/:groupId", async (req, res) => {
	try{
		const userId = await db.oneOrNone(
			"SELECT id FROM users WHERE firebase_uid = $(uid)",
			{
				uid: req.query.uid,
			}
		);
	
		if (!userId) {
			return res.status(404).send("The user could not be found");
		}

		const group = await db.oneOrNone("SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(user_id) WHERE g.id = $(group_id)",
				{
					user_id: userId.id,
					group_id: +req.params.groupId
				}
			);

		if (!group) {
			return res.status(404).send("The group could not be found");
		}

		res.status(200).json(group);

	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

// getGroupPostsById(id) : get group-posts by group with user id name & photo
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


// *** POST ROUTES ***

// addNewUser(user) : PLACEHOLDER

// addFirebaseUser(email, uid) : create a new user
router.post("/users-uid", async (req, res) => {
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

// addPostToGroup(uid, groupId, comment) : add a comment to a group
router.post("/group-posts", async (req, res) => {
	try {
		const user = await db.oneOrNone(
			"SELECT id FROM users WHERE firebase_uid = $(uid)",
			{
				uid: req.body.uid,
			}
		);

		await db.oneOrNone(
			"INSERT INTO group_posts (group_id, user_id, body) VALUES ($(group_id), $(user_id),$(comment)) RETURNING id",
			{
				group_id: req.body.group_id,
				user_id: user.id,
				comment: req.body.comment,
			}
		);

		const result = await db.many(
			"SELECT gp.id, gp.group_id, gp.date, gp.user_id, gp.body, u.first_name, u.last_name, u.photo FROM group_posts gp INNER JOIN users u ON u.id = gp.user_id WHERE gp.group_id = $(group_id) ORDER BY date DESC",
			{
				group_id: req.body.group_id,
			}
		);

		res.status(201).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

// addUserToGroupReturnGroups(uid, groupId) : add a user to a group (join button) & get back list of all groups
router.post("/group-members/groups/:uid", async (req, res) => {
	try {
		const userId = await db.oneOrNone(
			"SELECT id FROM users WHERE firebase_uid = $(uid)",
			{
				uid: req.params.uid,
			}
		);
	
		if (!userId) {
			return res.status(404).send("The user could not be found");
		}

		await db.oneOrNone(
			"INSERT INTO group_members (group_id, user_id) VALUES ($(group_id), $(user_id)) RETURNING id",
			{
				group_id: +req.body.group_id,
				user_id: userId.id,
			}
		);

		const groups = await db.manyOrNone("SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(id)",
			{
				id: userId.id
			}
		);

		if (!groups) {
			return res.status(404).send("The groups could not be found");
		}

		res.status(201).json(groups);

	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

// addUserToGroupReturnGroup(uid, groupId) : add a user to a group (join button) & get back only specific group
router.post("/group-members/group/:uid", async (req, res) => {
	try {
		const userId = await db.oneOrNone(
			"SELECT id FROM users WHERE firebase_uid = $(uid)",
			{
				uid: req.params.uid,
			}
		);
	
		if (!userId) {
			return res.status(404).send("The user could not be found");
		}

		await db.oneOrNone(
			"INSERT INTO group_members (group_id, user_id) VALUES ($(group_id), $(user_id)) RETURNING id",
			{
				group_id: +req.body.group_id,
				user_id: userId.id,
			}
		);

		const group = await db.oneOrNone("SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(user_id) WHERE g.id = $(group_id)",
				{
					user_id: userId.id,
					group_id: +req.body.group_id
				}
			);

		if (!group) {
			return res.status(404).send("The group could not be found");
		}

		res.status(201).json(group);

	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});


// *** PUT ROUTES ***

// updateUserUID(email, uid) : update a user record with the firebase UID when person signs up
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

// updateProfile(many) : update a user based on profile input values
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


// *** DELETE ROUTES ***

// deleteUserFromGroup(uid, groupId) : remove user from group (leave group)
router.delete("/group-members/:uid", async (req, res) => {
	try {
		const userId = await db.oneOrNone(
			"SELECT id FROM users WHERE firebase_uid = $(uid)",
			{
				uid: req.params.uid,
			}
		);
	
		if (!userId) {
			return res.status(404).send("The user could not be found");
		}

		await db.none(
			"DELETE FROM group_members WHERE user_id = $(user_id) AND group_id = $(group_id)",
			{
				group_id: +req.query.groupId,
				user_id: userId.id,
			}
		);
		
		const group = await db.oneOrNone("SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(user_id) WHERE g.id = $(group_id)",
			{
				user_id: userId.id,
				group_id: +req.query.groupId
			}
		);

		if (!group) {
			return res.status(404).send("The group could not be found");
		}
		
		res.status(200).json(group);
    
  } catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

// removePost(id) : delete a post from a group
router.delete("/group-comments/:id", async (req, res) => {
	console.log("Deleted");
	try {
		const post = await db.oneOrNone(
			"SELECT * FROM group_posts WHERE id = $(id)",
			{
				id: req.params.id,
			}
		);

		if (!post) {
			return res.status(404).send("Post does not exist.");
		}

		await db.none(`DELETE FROM group_posts WHERE id = $(id)`, {
			id: req.params.id,
		});
		const updatedPosts = await db.one("SELECT * FROM group_posts");

		res.status(201).json(updatedPosts);

	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
