// Helper function to parse the SQL data when fetching workouts list in the dashboard or athletepage
// Reformats the received data such that the "likedby" key 
// is reconfigured to have the value of an object with all athleteIds that have
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