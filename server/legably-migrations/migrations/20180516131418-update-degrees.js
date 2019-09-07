'use strict';

module.exports = {

    up(db, next) {
        db.collection('degrees').update({}, {$set: {status: 1}}, {upsert: false, multi: true}, next);
    },

    down(db, next) {
        // TODO write the statements to rollback your migration (if possible)
        db.collection('degrees').update({}, {$set: {status: true}}, {upsert: false, multi: true}, next);
    }

};
