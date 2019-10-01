
const rfr = require('rfr');
const invoiceModel = rfr('/server/models/invoice');
const db = rfr('/server/db');

const test = async () => {

    // invoiceModel.setStatusAsPaid(3);

    const { sequelize: seq } = db;

    // unmanaged transaction
/*
    let tHandler = null;
    try{
        tHandler = await seq.transaction();

        await db.Invoice.create({counselorId: 137}, {transaction: tHandler});

        throw new Error('should be rollback');
        tHandler.commit();
    }catch(e){
        tHandler.rollback();
    }
*/
    // managed transaction
    try{
        await seq.transaction(async (t1) => {
            const ret = await db.Invoice.create({counselorId: 137});
            console.log('aaa');
            const invoice = await db.Invoice.create({counselorId: 137});
            console.log('bbb');
            console.log(invoice.id);
            throw new Error('should be rollback');
        })
    }catch(err){
        console.log(err);
    };

}
test();