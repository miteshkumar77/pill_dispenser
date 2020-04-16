 const db_days = require('./models/dayOfWeek'); 
 const db_meds = require('./models/medicine');
 const webpush = require('web-push');

async function hourlyEligibleNotifications() {
    const dayOfWeeks = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ]; 

    const d = new Date(); 
    const today = dayOfWeeks[d.getDay()];
    const hour =  d.getHours();
    const medicineIds = (await db_days.findById({ _id: today })).medicineIds;
    const meds_db = Promise.all(
        medicineIds.map(medicineId => {
            return db_meds.find({ _id: medicineId , times: hour });
        })
    );
    
    return meds_db; 
}

async function sendNotification(registrations, payload) {
    console.log(registrations); 
    try {
        return Promise.all(registrations.map(registration => {
            return webpush.sendNotification(registration, JSON.stringify(payload[0]));
        }));
    }
    catch (err) {
        return console.error(err);
    }
    
}

async function configureNotification(meds_db, registrations) {

    
    const filtered = meds_db.filter(item => item.length != 0); 
    if (filtered.length != 0) {
        console.log(filtered);

        filtered.forEach(async med_arr => {
            const med = med_arr[0];
            console.log(med._id); 
            let res = await db_meds.findByIdAndUpdate(
                med._id,
                { $inc: { count: -med.dose }},
                { new: true, useFindAndModify: false }
            ).catch((err) => console.error(err));

            if (res.count <= 0) {
                res = null;
                await Promise.all([db_meds.findByIdAndDelete(med._id)
                    .catch((err) => console.error(err)), 
                    Promise.all(
                        med.dayNames.map(dayName => {
                            return db_days.findByIdAndUpdate(dayName, { $pull : { medicineIds: med._id }})
                            .catch((err) => console.error(err));
                        })
                    ).catch((err) => console.error(err))]
                ).catch((err) => console.error(err));
            }
        })

        await sendNotification(registrations, filtered); 
        
    }
}

function executeFuncEveryMinute(func) { // For testing only
    const d = new Date(); 
    const sec = d.getSeconds(); 
    const msUntilNextMinute = (60 - Number.parseInt(sec)) * 1000;
    console.log(`There are ${msUntilNextMinute / 1000}s until the top of the minute`);
    setTimeout(() => {
      func();
      setInterval(func, 60000);
    }, 
    msUntilNextMinute);
}

function executeFuncEveryHour(func) {
    const d = new Date(); 
    const sec = d.getSeconds(); 
    const hr = d.getHours();
    const msUntilNextHour = ((60 - Number.parseInt(sec)) + (60 - Number.parseInt(hr)) * 60)*1000
    console.log(`There are ${msUntilNextHour / 1000}s until the top of the hour`);
    setTimeout(() => {
        func();
        setInterval(func, 3600000);
    },
    msUntilNextHour);
}



module.exports = {
    hourlyEligibleNotifications,
    sendNotification,
    configureNotification,
    executeFuncEveryMinute,
    executeFuncEveryHour
};