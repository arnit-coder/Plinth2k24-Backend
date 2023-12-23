const Competition = require("../models/Competition");
const Contact = require("../models/Contact");

exports.CreateCompetition = async (req, res) => {
  try {
    console.log(req.body);
    const {
      clubOrganizingName,
      time,
      nameOfCompetition,
      image,
      soloOrTeam,
      about,
      prize,
      minTeamMembers,
      maxTeamMembers,
      rulebook,
      contacts,
    } = req.body;
    // if (
    //   !clubOrganizingName ||
    //   !time ||
    //   !nameOfCompetition ||
    //   !image ||
    //   !soloOrTeam ||
    //   !about ||
    //   !prize ||
    //   !rulebook ||
    //   !contacts || 
    //   !minTeamMembers ||
    //   !maxTeamMembers
    // ) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }
    const compName = await Competition.findOne({nameOfCompetition: nameOfCompetition});
    // if(compName){
    //   console.log(compName)
    //   return res.status(409).json({message:'This competition already exists', success: false});
    // }
    const contactObjects = [];
    for (const contactInfo of contacts) {
      const { name, number } = contactInfo;
      const contact = new Contact({ name, number });
      contactObjects.push(await contact.save());
    }
    const competition = new Competition({
      clubOrganizingName,
      time,
      nameOfCompetition,
      image,
      soloOrTeam,
      about,
      prize,
      minTeamMembers,
      maxTeamMembers,
      rulebook,
      contacts: contactObjects.map((contact) => contact._id),
    });
    const newCompetition = await competition.save();

    return res.status(201).json({
      success: true,
      data: newCompetition,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Error creating the competition" });
  }
};

exports.FetchAllCompetition = async (req, res) => {
  try {
    const allComeptition = await Competition.find({})
      .populate("contacts")
      .exec();
    allComeptition.teams = [];

    return res.status(200).json(allComeptition);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching the competitions" });
  }
};

exports.UpdateCompetition = async (req, res) => {
  try {
    const {updateFields, competitionId} = req.body;
    const existingCompetition = await Competition.findById(competitionId);

    if (!existingCompetition) {
      return res.status(404).json({ message: "Competition not found", success: false });
    }

    for (const field in updateFields) {
      if (Object.prototype.hasOwnProperty.call(updateFields, field)) {
        existingCompetition[field] = updateFields[field];
      }
    }
    const updatedCompetition = await existingCompetition.save();

    return res.status(200).json({
      success: true,
      data: updatedCompetition,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error updating the competition" });
  }
};

exports.DeleteCompetition = async (req, res) => {
	try {
		const { competitionId } = req.body;
		const details = await Competition.findByIdAndDelete(competitionId);
		return res.status(201).json({
			success: true,
			details,
			message: "Competition Removed",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Error deleting the competition" });
	}
};