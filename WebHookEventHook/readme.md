# Web Hook Event Hook Example

Cloud Elements accepts four event types, in all caps: UPDATED, CREATED, DELETED, or UNKNOWN. Many providers have a large number of event types that need to be associated with one of Cloud Element's types so that the platform can ingest them.

From there, Cloud Elements needs an event object similar to the below:
```
{
    "event_date": date,
    "event_object_id": objectId,
    "event_type": OneOfTheFourTypesAbove,
    "event_object_type": TheObjectTheEventIsFor
}
```
In this example, a web hook payload from Zoom is being formatted so that Cloud Elements will accept it and send notification.

Original Zoom event data for a new user getting created:
```
{
    "event": "user.created",
    "payload": {
        "account_id": "9AztU893gFTfGcCw",
        "creation_type": "create",
        "object": {
            "email": "kia.martinez+newContact@cloud-elements.com",
            "first_name": "New",
            "id": "987abC654DEf321xYz",
            "last_name": "Contact",
            "type": 1
        },
        "operator": "zoomaccountemail@gmail.com",
        "operator_id": "123456789ABC"
  }
  ```

## Code Explanation

From this event payload, our example:
  1. Creates a function that will parse the data from `event` and return an object with `{user, created}`.
```
const parse = (data) => {
    let [object, action] = data.split('.');
    return {
      object, action
    };
  };
```
  2. From Zoom's API documentation, all event actions are considered in a switch case, which will group all actions into the most relevant Cloud Element's event type (one of `UPDATED`, `CREATED`, `DELETED`, or `UNKNOWN`).
```
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
```
  3. Lastly, the script will create the event object as Cloud Element's expects it to be formatted, referring to the correct fields from the Zoom even payload, and pass it into done with the key `events`.
```
  const date = new Date().toISOString();
  const event = {
  "event_date": date,
  "event_object_id": events.payload.object.id,
  "event_type": newAction,
  "event_object_type": object
  };
  
  done({ "events": [event] });
```