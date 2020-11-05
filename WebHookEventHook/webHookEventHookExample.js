// Creates a function that parses the event field (from the provider payload) into object and action.
const parse = (data) => {
    let [object, action] = data.split('.');
    return {
      object, action
    };
  };
  // Switch case that takes all of Zoom's actions and funnels them into one of Cloud Elements accepted event types: UPDATED, CREATED, DELETED, or UNKNOWN.
  let newAction = '';
  const {object, action} = parse(events.event);
  switch (action) {
    case 'activated':
    case 'disassociated':
    case 'started':
    case 'stopped':
    case 'ended': 
    case 'registration_cancelled':
    case 'registration_approved':
    case 'registration_denied':
    case 'participant_jbh_joined':
    case 'participant_jbh_waiting':    
      newAction = 'UPDATED';
      break;
    case 'registration_created':
    case 'created':
      newAction = 'CREATED';
      break;
    case 'deleted':
      newAction = 'DELETED';
      break;
    default:
      newAction = 'UNKNOWN';
  }
  // Constructs the event object in the format Cloud Elements expects and passes it as an array to "events" in done.
  const date = new Date().toISOString();
  const event = {
  "event_date": date,
  "event_object_id": events.payload.object.id,
  "event_type": newAction,
  "event_object_type": object
  };
  
  done({ "events": [event] });
  
  