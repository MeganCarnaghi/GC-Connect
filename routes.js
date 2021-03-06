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
router.get("/", async (req, res) => {
  res.send("The back end is working!");
});
// getAllUsers() : gets all users for directory
router.get("/users", async (req, res) => {
  res.json(await db.many("SELECT * from users WHERE authorized = true AND firebase_uid != 'UID' ORDER BY last_name"));
});

//  getUserByUid(uid) : gets user by uid for profile/popup
router.get("/users/:uid", async (req, res) => {
  const result = await db.one(
    "SELECT u.*, b.zoom from users u LEFT JOIN bootcamps b on u.bootcamp = b.name WHERE firebase_uid = $(uid)",
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
  const result = await db.one("SELECT * from users WHERE id = $(id)", {
    id: req.params.id,
  });

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
  try {
    const userId = await db.one("SELECT id from users WHERE firebase_uid = $(uid)", {
      uid: req.params.uid,
    });

    if (!userId) {
      return res.status(404).send("The user could not be found");
    }

    const groups = await db.manyOrNone(
      "SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(id) ORDER BY gm.user_id ASC",
      {
        id: userId.id,
      }
    );

    if (!groups) {
      return res.status(404).send("There are no groups.");
    }

    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// getGroupByIdAndUserJoin(groupId, uid) : get specific group by group ID with user ID if member
router.get("/group-details/:groupId", async (req, res) => {
  try {
    const userId = await db.oneOrNone("SELECT id FROM users WHERE firebase_uid = $(uid)", {
      uid: req.query.uid,
    });

    if (!userId) {
      return res.status(404).send("The user could not be found");
    }

    const group = await db.oneOrNone(
      "SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(user_id) WHERE g.id = $(group_id)",
      {
        user_id: userId.id,
        group_id: +req.params.groupId,
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
  const result = await db.manyOrNone(
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

// addNewUser(user) : create a new user
router.post("/users", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT email FROM users WHERE email = $(email)", {
      email: req.body.email,
    });

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

    const newUser = await db.one("SELECT email FROM users WHERE email = $(email)", {
      email: req.body.email,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// addFirebaseUser(email, uid) : create a new user
router.post("/users-uid", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT email FROM users WHERE email = $(email)", {
      email: req.body.email,
    });

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

    const newUser = await db.one("SELECT email FROM users WHERE email = $(email)", {
      email: req.body.email,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// addPostToGroup(uid, groupId, comment) : add a comment to a group
router.post("/group-posts", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT id FROM users WHERE firebase_uid = $(uid)", {
      uid: req.body.uid,
    });

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
    const userId = await db.oneOrNone("SELECT id FROM users WHERE firebase_uid = $(uid)", {
      uid: req.params.uid,
    });

    if (!userId) {
      return res.status(404).send("The user could not be found");
    }

    await db.oneOrNone("INSERT INTO group_members (group_id, user_id) VALUES ($(group_id), $(user_id)) RETURNING id", {
      group_id: +req.body.group_id,
      user_id: userId.id,
    });

    const groups = await db.manyOrNone(
      "SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(id) ORDER BY gm.user_id ASC",
      {
        id: userId.id,
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
    const userId = await db.oneOrNone("SELECT id FROM users WHERE firebase_uid = $(uid)", {
      uid: req.params.uid,
    });

    if (!userId) {
      return res.status(404).send("The user could not be found");
    }

    await db.oneOrNone("INSERT INTO group_members (group_id, user_id) VALUES ($(group_id), $(user_id)) RETURNING id", {
      group_id: +req.body.group_id,
      user_id: userId.id,
    });

    const group = await db.oneOrNone(
      "SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(user_id) WHERE g.id = $(group_id)",
      {
        user_id: userId.id,
        group_id: +req.body.group_id,
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
    const user = await db.oneOrNone("SELECT email FROM users WHERE email = $(email)", {
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).send("User email does not exist.");
    }

    await db.oneOrNone("UPDATE users SET firebase_uid = $(firebase_uid) WHERE email = $(email)", {
      email: req.params.email,
      firebase_uid: req.body.firebase_uid,
    });

    const updatedUser = await db.one("SELECT email, firebase_uid FROM users WHERE email = $(email)", {
      email: req.params.email,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// updateProfile(many) : update a user based on profile input values
router.put("/users-profile/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

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

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

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
    const userId = await db.oneOrNone("SELECT id FROM users WHERE firebase_uid = $(uid)", {
      uid: req.params.uid,
    });

    if (!userId) {
      return res.status(404).send("The user could not be found");
    }

    await db.none("DELETE FROM group_members WHERE user_id = $(user_id) AND group_id = $(group_id)", {
      group_id: +req.query.groupId,
      user_id: userId.id,
    });

    const group = await db.oneOrNone(
      "SELECT g.*, gm.user_id FROM groups g LEFT JOIN group_members gm on gm.group_id = g.id AND gm.user_id = $(user_id) WHERE g.id = $(group_id)",
      {
        user_id: userId.id,
        group_id: +req.query.groupId,
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

// removePost(id) : delete comment from a group
router.delete("/group-comments/:id", async (req, res) => {
  console.log("Deleted");
  try {
    const post = await db.oneOrNone("SELECT * FROM group_posts WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!post) {
      return res.status(404).send("Post does not exist.");
    }

    await db.none(`DELETE FROM group_posts WHERE id = $(id)`, {
      id: req.params.id,
    });

    // const updatedPosts = await db.one("SELECT * FROM group_posts");

    const updatedPosts = await db.many(
      "SELECT gp.id, gp.group_id, gp.date, gp.user_id, gp.body, u.first_name, u.last_name, u.photo FROM group_posts gp INNER JOIN users u ON u.id = gp.user_id WHERE gp.group_id = $(group_id) ORDER BY date DESC",
      {
        group_id: req.query.groupId,
      }
    );

    res.status(201).json(updatedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// update a user's onboarding tasks based on completion (checkbox checked)
//--SLACK ONLY
router.put("/users-onboarding-slack/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET setup_slack = $(setup_slack) WHERE id = $(id)", {
      id: req.params.id,
      setup_slack: req.body.setup_slack,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//--TUITION ONLY
router.put("/users-onboarding-tuition/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET pay_tuition = $(pay_tuition) WHERE id = $(id)", {
      id: req.params.id,
      pay_tuition: req.body.pay_tuition,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// --GTKY SURVEY
router.put("/users-onboarding-survey/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET gtky_survey = $(gtky_survey) WHERE id = $(id)", {
      id: req.params.id,
      gtky_survey: req.body.gtky_survey,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// --CREATE PROFILE
router.put("/users-onboarding-profile/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET create_profile = $(create_profile) WHERE id = $(id)", {
      id: req.params.id,
      create_profile: req.body.create_profile,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// --CHECK LMS
router.put("/users-onboarding-lms/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET check_lms = $(check_lms) WHERE id = $(id)", {
      id: req.params.id,
      check_lms: req.body.check_lms,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// --CHECK LMS
router.put("/users-onboarding-zoom/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET mark_zoom = $(mark_zoom) WHERE id = $(id)", {
      id: req.params.id,
      mark_zoom: req.body.mark_zoom,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// --CHECK CALENDAR
router.put("/users-onboarding-calendar/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET check_calendar = $(check_calendar) WHERE id = $(id)", {
      id: req.params.id,
      check_calendar: req.body.check_calendar,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// --CAREER SERVICES
router.put("/users-onboarding-cs/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET career_services = $(career_services) WHERE id = $(id)", {
      id: req.params.id,
      career_services: req.body.career_services,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// --EXPLORE GROUPS
router.put("/users-onboarding-groups/:id", async (req, res) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    await db.oneOrNone("UPDATE users SET explore_groups = $(explore_groups) WHERE id = $(id)", {
      id: req.params.id,
      explore_groups: req.body.explore_groups,
    });

    const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
      id: req.params.id,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// // update a user's onboarding tasks based on completion (checkbox checked)
// router.put("/users-onboarding/:id", async (req, res) => {
//   try {
//     const user = await db.oneOrNone("SELECT * FROM users WHERE id = $(id)", {
//       id: req.params.id,
//     });

//     if (!user) {
//       return res.status(404).send("User does not exist.");
//     }

//     await db.oneOrNone(
//       "UPDATE users SET setup_slack = $(setup_slack), pay_tuition = $(pay_tuition), gtky_survey = $(gtky_survey), create_profile = $(create_profile), check_lms = $(check_lms), mark_zoom = $(mark_zoom), check_calendar = $(check_calendar), career_services = $(career_services), explore_groups = $(explore_groups) WHERE id = $(id)",
//       {
//         id: req.params.id,
//         setup_slack: req.body.setup_slack,
//         pay_tuition: req.body.pay_tuition,
//         gtky_survey: req.body.gtky_survey,
//         create_profile: req.body.create_profile,
//         check_lms: req.body.check_lms,
//         mark_zoom: req.body.mark_zoom,
//         check_calendar: req.body.check_calendar,
//         career_services: req.body.career_services,
//         explore_groups: req.body.explore_groups,
//       }
//     );

//     const updatedUser = await db.one("SELECT * FROM users WHERE id = $(id)", {
//       id: req.params.id,
//     });

//     res.status(201).json(updatedUser);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// get onboarding checklist completion information for a user
router.get("/user-onboarding-tasks/:uid", async (req, res) => {
  const taskStatus = await db.oneOrNone(
    "SELECT setup_slack, pay_tuition, gtky_survey, create_profile, check_lms, mark_zoom, check_calendar, career_services, explore_groups FROM users WHERE firebase_uid = $(uid)",
    {
      uid: req.params.uid,
    }
  );

  if (!taskStatus) {
    return res.status(404).send("The information could not be found.");
  }

  res.json(taskStatus);
});

// create a new group
router.post("/groups", async (req, res) => {
  try {
    const group = await db.oneOrNone("SELECT name FROM groups WHERE name = $(name)", {
      name: req.body.name,
    });

    if (group) {
      return res.status(404).send("This group already exists.");
    }

    await db.none("INSERT INTO groups (name, type, bio, photo) VALUES ($(name), $(type), $(bio), $(photo))", {
      name: req.body.name,
      type: req.body.type,
      bio: req.body.bio,
      photo: req.body.photo,
    });

    const newGroup = await db.one("SELECT name FROM groups WHERE name = $(name)", {
      name: req.body.name,
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
