
const rfr = require('rfr');
const db = rfr('/server/db/');
const moment = require('moment');

const test = async () => {

    const timezoneTest = async () => {
        try{
            const result = await db.Invoice.create({
                issueAt: new Date()
            },{ plain: true });

            // // console.log(result);
            console.log(""+new Date(result.issueAt));
        }catch(e){
            console.log(e);
        }
    }

    const momentUTC = () => {
        console.log(moment().format());
    }

    momentUTC();
}
test();