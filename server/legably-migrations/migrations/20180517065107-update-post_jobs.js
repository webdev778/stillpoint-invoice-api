'use strict';

module.exports = {

    up(db, next) {
        db.collection('post_jobs').update({}, {$set: {status: 1}}, {upsert: false, multi: true}, next);
    },

    down(db, next) {
        // TODO write the statements to rollback your migration (if possible)
        db.collection('post_jobs').update({}, {$set: {status: 'POST'}}, {upsert: false, multi: true}, next);
    }

};
