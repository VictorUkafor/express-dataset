
const Datastore = require('nedb');
const db = new Datastore({ filename : 'events', autoload: true });

db.loadDatabase();



const getAllEvents = (req, res) => {
	db.find({}, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error' 
			});					
		}
		
		return res.status(200).json({ 
			events: docs,
		});
	});

};

const addEvent = (req, res) => {
	const { event } = req.body;
	db.find({}, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error' 
			});					
		}

		if(!event){
			return res.status(400).json({ 
				error: 'Please pass a JSON event' 
			});	
		}

		if(!event.id){
			return res.status(400).json({ 
				error: 'Please pass an ID to the event JSON' 
			});	
		}

		const eventExist = docs.find(each => each.id == event.id);

		if(eventExist){
			return res.status(400).json({ 
				error: 'An event with this id already exist' 
			});	
		}

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
	db.find({}, (err, docs) => { 
		if(err){
			return res.status(500).json({ 
				error: 'Internal server error' 
			});					
		}

		const byAnActor = docs.filter(each => each.actor.id == actorId);
		
		return res.status(200).json({ events: byAnActor });
	});
};


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

















