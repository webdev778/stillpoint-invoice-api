/** Method for convert objectId into Date **/
export const dateFromObjectId = (objectId) => {
	console.log("objectId : " ,objectId);
	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
} 