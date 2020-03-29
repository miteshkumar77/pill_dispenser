 const db_days = require('./models/dayOfWeek'); 
 const db_meds = require('./models/medicine');

async function hourlyEligibleNotifications() {
    const dayOfWeeks = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ]; 

    const d = new Date(); 
    const today = dayOfWeeks[d.getDay()];
    const hour =  d.getHours();
    const medicineIds = (await db_days.findById({ _id: today })).medicineIds;
    const meds_db = await Promise.all(
        medicineIds.map(medicineId => {
            return db_meds.find({ _id: medicineId , times: hour });
        })
    );
    return meds_db; 
}

function sendNotification(meds_db) {
    console.log(meds_db);
}






module.exports = {
    hourlyEligibleNotifications,
    sendNotification
};