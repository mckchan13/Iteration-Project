// Helper function to parse the SQL data
// Reformats the received data so that the query response is reformatted
// such that the likedby key is reconfigured to contain all athleteIds that have
// liked the card.

function workoutParser(workoutsList) {
    const workoutIdCache = {};
    const parsedWorkoutsList = [];
    for (let i = 0; i < workoutsList.length; i++) {
        if (!workoutIdCache[workoutsList[i]._id]) {
            workoutIdCache[workoutsList[i]._id] = parsedWorkoutsList.length;
            const { likedby } = workoutsList[i]
            const newWorkoutCard = { ...workoutsList[i], likedby: {} }
            if (!likedby) {
                parsedWorkoutsList.push(newWorkoutCard);
                continue;
            }
            newWorkoutCard.likedby[likedby] = true;
            parsedWorkoutsList.push(newWorkoutCard);
        } else {
            const currIdx = workoutIdCache[workoutsList[i]._id]
            const { likedby } = workoutsList[i]
            if (!likedby) {
                continue;
            }
            parsedWorkoutsList[currIdx].likedby[likedby] = true;
        }
    }
    return parsedWorkoutsList;
}

export default workoutParser;