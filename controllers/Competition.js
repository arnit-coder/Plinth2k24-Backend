const Competition = require("../models/Competition");
const Contact = require("../models/Contact");

exports.CreateCompetition = async (req, res) => {
  try {
    const {
      clubOrganizingName,
      time,
      nameOfCompetition,
      image,
      soloOrTeam,
      about,
      prize,
      rulebook,
      contacts,
    } = req.body;
    if (
      !clubOrganizingName ||
      !time ||
      !nameOfCompetition ||
      !image ||
      !soloOrTeam ||
      !about ||
      !prize ||
      !rulebook ||
      !contacts
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
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
      rulebook,
      contacts: contactObjects.map((contact) => contact._id),
    });
    const newCompetition = await competition.save();

    res.status(201).json({
      success: true,
      data: newCompetition,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error creating the competition" });
  }
};

exports.FetchAllCompetition = async (req, res) => {
  try {
    const allComeptition = Competition.find({});
    res.status(200).send(allComeptition);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching the competitions" });
  }
};

exports.UpdateCompetition = async (req, res) => {
  try {
    const {
      clubOrganizingName,
      time,
      nameOfCompetition,
      image,
      soloOrTeam,
      about,
      prize,
      rulebook,
      contacts,
    } = req.body;
  } catch (err) {}
};
