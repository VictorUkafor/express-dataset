const db = require('../config');


var getAllActors = (req, res) => {
	
};


const updateActor = (req, res) => {
	const { actor } = req.body;		
	
	if(!actor){
		return res.status(400).json({ error: 'Please pass the actor JSON' });	
	}

	if(!actor.id){
		return res.status(400).json({ error: 'An id is required in the actor JSON' });	
	}

	db.find({ "actor.id": actor.id }, (err, docs) => { 
		if(err){
			return res.status(500).json({ error: 'Internal server error', err });					
		}

		if(!docs.length){
			return res.status(404).json({ error: 'No event of the actor found' });				
		}

		db.update({ "actor.id": actor.id }, { $set: { "actor.avatar_url": actor.avatar_url } }, 
		{ multi: true, returnUpdatedDocs: true }, (err, updatedDocs) => {
			if(err){
				return res.status(500).json({ error: 'Internal server error', err });					
			}
			
			return res.status(200).json({ 
				success: 'Events updated successfully',
				events: updatedDocs 
			});
		});
			
	});

};

var getStreak = () => {

};


module.exports = {
	updateActor,
	getAllActors,
	getStreak
};

















