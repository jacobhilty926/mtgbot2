const fetch = require("node-fetch")
const stringify = require('json-stringify')

const makeChannelSender = channel => message => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + process.env.OAUTH_TOKEN
  }

  fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: headers,
    body: stringify({
      channel: channel,
      text: message
    })
  }).then(response => response.json())
    .then(json => { console.log(json) })
    .catch(ex => {
      console.log('Err: ' + ex)
    })
}

const getUserList = function() {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + process.env.OAUTH_TOKEN
  }
  
  return fetch("https://slack.com/api/users.list", {
    method: "GET",
    headers: headers
  }).then(response => response.json())
    .then(json => {
      return json
    })
}

const makeDMSender = (values, player) => {
  const data = values[1]["members"]
  const message = values[0]
  console.log("Sending message to " + player)
  const userId = getIdByName(data, player)
  console.log("User: " + player + " Id: " + userId)
  
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + process.env.OAUTH_TOKEN
    }

    fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: headers,
      body: stringify({
        channel: userId,
        text: message,
        as_user: false
      })
    }).then(response => response.json())
      .then(json => { console.log(json) })
      .catch(ex => {
        console.log('Err: ' + ex)
      })
}

const getIdByName = (memberList, name) => {
  const result  = memberList.filter(member => {
    if (member.name === "SeriousMTGBot"){
      console.log(member)
    }
    return member["name"] === name
  })
  if (result){
    console.log("Found user")
  } else {
    console.log("User not found")
  }
  return result ? result[0].id : null;
}

const helpers = {
  makeChannelSender: makeChannelSender,
  makeDMSender: makeDMSender,
  getUserList: getUserList,
  card_pattern: new RegExp('^![0-9a-zA-Z]+'),
  rule_pattern: new RegExp('^![0-9]{3}(\.[0-9]{2}){0,1}$'),
  // TODO: Handle !define <trample etc.>, likely before the card pattern
  rule_lookup: function(text, channel) {
    makeChannelSender(channel)("Rules lookup not implemented yet, sorry friends")
  }
}


module.exports = helpers