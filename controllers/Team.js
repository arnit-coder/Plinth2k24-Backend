const Competition = require("../models/Competition");
const Team = require("../models/Team");
const User = require("../models/User");

exports.createTeam = async (req, res) => {
  try {
    //members is an array of emails of the members
    const { name, members, competition } = req.body;
    if (!name || !members || !competition) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const currentCompetition = await Competition.findById(competition);
    if(members.length > currentCompetition.maxTeamMembers || members.length < currentCompetition.minTeamMembers){
      return res.status(400).json({ message: "Not valid number of members!" });
    }

    const membersObjects = [];

    for (const member of members) {
      const userObject = await User.findOne({ email: member }).populate(
        "teams"
      );
      membersObjects.push(userObject);
      for (const team of userObject.teams) {
        if (team.competition == competition) {
          return res.status(400).json({
            message: "Some member is alreday registerd for this competition ",
          });
        }
      }
    }
    const currentUser = await User.findById(req.user._id).populate("teams");

    for(const team of currentUser.teams){
      if(team.competition == competition){
        return res.status(400).json({
          message: "The leader of this team has already been registerd for this competition",
        });
      }
    }


    const team = new Team({
      name: name,
      leader: req.user._id,
      members: membersObjects.map((member) => member._id),
      competition: competition,
    });

    const newTeam = await team.save();
    currentUser.teams.push(newTeam._id);
    currentUser.save();

    const currentCompetition = await Competition.findById(competition);
    currentCompetition.teams.push(newTeam._id);
    currentCompetition.save();

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
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const teamToBeDeleted = await Team.findById(teamId);
    if (!teamToBeDeleted) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (teamToBeDeleted.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the leader" });
    }
    const members = teamToBeDeleted.members;
    for (const member of members) {
      const teams = member.teams;
      const index = teams.indexOf(teamId);
      if (index > -1) {
        teams.splice(index, 1);
      }
      await User.findByIdAndUpdate(member._id, { teams: teams });
    }
    //delete the team from leader also
    const teams = req.user.teams;
    const index = teams.indexOf(teamId);

    if (index > -1) {
      teams.splice(index, 1);
    }
    await User.findByIdAndUpdate(req.user._id, { teams: teams });
    //delete the team

    await Team.findByIdAndDelete(teamId);
    res.status(200).json({ success: true, message: "Team deleted" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching the competitions" });
  }
};

//get all team for the admin
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({});
    res.status(200).json({ success: true, data: teams });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching the teams" });
  }
};

//get user team for the user
exports.getYourTeam = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);
    const teams = currentUser.teams;
    const teamObjects = [];

    for (const team of teams) {
      const teamObject = await Team.findById(team);
      teamObjects.push(teamObject);
    }

    res.status(200).json({ success: true, data: teamObjects });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching the teams" });
  }
};

//fetchYourTeam function to fetch the team of the user , any teammate can fetch the team and leader can also fetch the team
