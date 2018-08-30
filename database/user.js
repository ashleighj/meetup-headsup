"use strict"

let db = require('../database/database')
let messages = require('../messages/messages')

let checkRecordExists = (slackTeamId) => {
    let existsQuery =
        `select 
            exists(
              select 1 
              from user 
              where slack_id like '${slackTeamId}') 
          as already_exists;`

    return new Promise((resolve, reject) => {

        db.query(existsQuery).then((result) => {
            resolve(result[0].already_exists === 1)
        },(err) => {
            reject(err)
        })
    })
}

module.exports = {

    insert: (
        slackTeamId,
        slackTeamName) => {

        let insertQuery =
            `insert into user(
                slack_id, 
                slack_domain) 
            values (
                '${slackTeamId}', 
                '${slackTeamName}');`

        return new Promise((resolve, reject) => {

            checkRecordExists(slackTeamId).then((exists) => {

                if (!exists) {
                    db.query(insertQuery).then(() => {
                        resolve(messages.system.USER_INSERT_SUCCESS)

                    }, (err) => {
                        reject(err)
                    })
                }
                resolve(messages.system.USER_EXISTS)

            },(err) => {
                reject(err)
            })
        })
    },

    findUser: (slackTeamId) => {

        let findUserQuery =
            `select id 
                  from user 
                  where slack_id 
                  like '${slackTeamId}';`

        return new Promise(
            (resolve, reject) => {

                db.query(findUserQuery).then((result) => {
                    resolve(result[0].id)
                },(err) => {
                    reject(err)
                })
        })
    },

    checkRecordExists: checkRecordExists
}