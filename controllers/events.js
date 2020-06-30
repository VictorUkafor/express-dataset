const db = require('../config');

// method for fetching all events from the database
const getAllEvents = (req, res) => {
	db.find({}, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error' 
			});					
		}

		// sorting events by their ids in ascending order
		const events = docs.sort((a, b) => a.id - b.id);
		
		return res.status(200).json({ events });
	});
};


// method for posting events
const addEvent = (req, res) => {
	const { event } = req.body;		
	
	// if event JSON is not passed to request body
	if(!event){
		return res.status(400).json({ 
			error: 'Please pass a JSON event' 
		});	
	}

	// if id is not passed to event JSON
	if(!event.id){
		return res.status(400).json({ 
			error: 'Please pass an ID to the event JSON' 
		});	
	}

	// find events with the id of event.id
	db.find({ id: event.id }, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error' 
			});					
		}

		// if an event with the id exist
		if(docs.length){
			return res.status(400).json({ 
				error: 'An event with this id already exist' 
			});	
		}

		// insert event to the database
		db.insert(event, (err, newDocs) => {
			if(err){
				return res.status(500).json({ 
					error: 'Internal server error' 
				});					
			}
			
			return res.status(201).json({ 
				success: 'Event added successfully',
				events: newDocs,
			});
		});
	});
};


const getByActor = (req, res) => {
	const { actorId } = req.params;

	// find events with the actor id of actorId
	db.find({ "actor.id": actorId }, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error' 
			});					
		}
		
		return res.status(200).json({ events: docs });
	});
};


// method for removing all events
const eraseEvents = (req, res) => {
	db.remove({}, { multi: true }, (err, numRemoved) => {
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error' 
			});					
		}

		return res.status(200).json({ success: 'Events removed successfully' });		
	});

};


module.exports = {
	getAllEvents,
	addEvent,
	getByActor,
	eraseEvents
};

















