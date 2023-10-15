const Competition = require('../models/Competition');

exports.CreateCompetition = async(req, res) => {
  try{
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
    if (!clubOrganizingName || !time || !nameOfCompetition || !image || !soloOrTeam || !about || !prize || !rulebook || !contacts) {
      return res.status(400).json({ message: 'All fields are required' });
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
      contacts,
    });
    const newCompetition = await competition.save();

    res.status(201).json({
      success: true,
      data: newCompetition,
    });
  } catch(err){
    console.error(err);
    res.status(500).json({ success:false, message: 'Error creating the competition' });
  }
}

exports.FetchAllCompetition = async(req, res) => {
  try{
    const competitions = await Competition.find().sort({ createdAt:-1}).populate("Contact").exec();
    if(!competitions){
      throw Error("No competitions found");
      }
    res.status(200).json({success:true, count:competitions.length, data:competitions})
  } catch(err){
    console.error(err);
    res.status(500).json({ success:false, message: 'Error fetching the competitions' });
  }
}