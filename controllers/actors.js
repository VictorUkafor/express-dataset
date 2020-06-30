const db = require('../config');

// get all actors sorted by the number of events, 
//event created time and login
const getAllActors = (req, res) => {
	db.find({}, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error', 
				err 
			});					
		} 

	    const actorEvents = {}

		// get number of events by an actor and values
		// the actorEvents
		docs.map(doc => {
			if(actorEvents[doc.actor.id]){
				actorEvents[doc.actor.id].count += 1;
				actorEvents[doc.actor.id].latestEvent = doc;
			} else {
				actorEvents[doc.actor.id] = { 
					count: 1,
					actor: doc.actor,
					latestEvent: doc
				};
			}
		});


		const sortedEvents = Object.values(actorEvents).sort((a, b) =>  
		// sort by number of events in descending order
		b.count - a.count && 
		// sort by created_at of events in descending order
		new Date(b.latestEvent.created_at).getTime() - new Date(a.latestEvent.created_at).getTime() &&
		// sort by login of actor in descending order
		b.actor.login - a.actor.login);

		const actors = sortedEvents.map(each => each.actor);

		return res.status(200).json({ actors });
	});
	
};


// method for updating the avatar URL of the actor
const updateActor = (req, res) => {
	const { actor } = req.body;		
	
	// if actor is not passed
	if(!actor){
		return res.status(400).json({ 
			error: 'Please pass the actor JSON' 
		});	
	}

	// if the id of the actor is not found
	if(!actor.id){
		return res.status(400).json({ 
			error: 'An id is required in the actor JSON' 
		});	
	}

	// find events with an actor id of actor.id
	db.find({ "actor.id": actor.id }, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error', 
				err 
			});					
		}

		// if no events is found
		if(!docs.length){
			return res.status(404).json({ 
				error: 'No event of the actor found' 
			});				
		}

		// update all events with an actor id of actor.id
		db.update({ "actor.id": actor.id }, 
		{ $set: { "actor.avatar_url": actor.avatar_url } }, 
		{ multi: true, returnUpdatedDocs: true }, (err, updatedDocs) => {
			if(err){
				return res.status(500).json({ 
					error: 'Internal server error', 
					err 
				});					
			}
			
			return res.status(200).json({ 
				success: 'Events updated successfully',
			});
		});
			
	});

};


// fetch all actor records ordered by the maximum streak
const getStreak = (req, res) => {
	db.find({}, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error', 
				err 
			});					
		} 

		const actorEvents = {}

		// get actor based on their streak
		docs.map(doc => {
			if(actorEvents[doc.actor.id]){
				const date = new Date(doc.created_at).getDate();
				if(date > actorEvents[doc.actor.id].lastDay){
					actorEvents[doc.actor.id].days += 1;
					actorEvents[doc.actor.id].lastDay = doc.created_at.getDate();
				    actorEvents[doc.actor.id].latestEvent = doc;					
				}
			} else {
				const lastDay = new Date(doc.created_at).getDate();
				actorEvents[doc.actor.id] = { 
					days: 1,
					lastDay,
					actor: doc.actor,
					latestEvent: doc
				};
			}
		});

        // sort events
		const sortEvents = Object.values(actorEvents).sort((a, b) =>  
		b.days - a.days && 
		new Date(b.latestEvent.created_at).getTime() - new Date(a.latestEvent.created_at).getTime() &&
		b.actor.login - a.actor.login);

		const actors = sortEvents.map(each => each.actor);

		return res.status(200).json({ actors });
	});
	
};


module.exports = {
	updateActor,
	getAllActors,
	getStreak
};

















