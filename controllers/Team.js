const Team = require("../models/Team");
const User = require("../models/User");

exports.createTeam = async (req, res) => {
  try {
    //members is an array of emails of the members
    const { name, members } = req.body;
    if (!name || !members) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const membersObjects = [];

    for (const member of members) {
      membersObjects.push(await User.findOne({ email: member }));
    }

    const team = new Team({
      name: name,
      leader: req.user._id,
      members: membersObjects.map((member) => member._id),
    });

    const newTeam = await team.save();

    // update the leader

    const teams = req.user.teams;
    teams.push(newTeam._id);
    await User.findByIdAndUpdate(req.user._id, { teams: teams });

    // update the members
    for (const member of membersObjects) {
      const teams = member.teams;
      teams.push(newTeam._id);
      await User.findByIdAndUpdate(member._id, { teams: teams });
    }
    res.status(201).json({
      success: true,
      data: newTeam,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error creating the team" });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the leader" });
    }
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Team deleted" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching the competitions" });
  }
};

//fetchYourTeam function to fetch the team of the user , any teammate can fetch the team and leader can also fetch the team
