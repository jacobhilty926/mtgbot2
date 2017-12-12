// This is where we'll have all our handlers, the things which do actual specialized work

const helpers = require('./helpers.js')
const lookupCardByMessage = require('./card-lookups').lookupCardByMessage
const cardLookupBySetNumber = require('./card-lookups').cardLookupBySetNumber
const lookupPackOfCardsBySet = require('./card-lookups').lookupPackOfCardsBySet
const renderListOfCards = require('./renderers').renderListOfCards
const sendDraftToEachPlayer = require('./slack-senders').sendDraftToEachPlayer

var handlers = {
  handle_url_verification: function(body) {
    if (body.token === process.env.VERIFICATION_TOKEN) {
      return body.challenge
    }
    return "error: token doesnt match"
  },
  
  handle_event_callback: function(body) {
    // This is gonna be kinda small for now!
    const evt = body.event
    const text = evt.text || ''
    
    const sendToChannel = helpers.makeChannelSender(evt.channel)
    
    console.log(text)
    
    if (text === "!test") {
      console.log('doing things')
      sendToChannel('This was a test!')
      return "success"
    } else if (text.startsWith("!draft")){
      console.log('start a draft')
      
      const openBracket = text.indexOf("[")
      const closedBracket = text.indexOf("]")
      if (openBracket && closedBracket && openBracket < closedBracket) {
        const draftPlayerList = text.slice(openBracket + 1, closedBracket).split(",")
        sendDraftToEachPlayer(draftPlayerList)
      } else {
        sendToChannel('To start a draft this is the proper format:\n !draft [player1, player2, player3, player4, ...]')
      }
    } else if (text.startsWith("!pack of")) {
      console.log('Matches pack generation')
      
      const command = text.split(" ")
      const set = command[command.length - 1]
      
      lookupPackOfCardsBySet(set)
        .then( renderListOfCards )
        .then( sendToChannel )
    } else if (helpers.rule_pattern.test(text)) {
      console.log('Matches the rules')
      helpers.rule_lookup(text)
    } else if (helpers.card_pattern.test(text) || (text.startsWith('!"') && (text.endsWith('"')))) {
      console.log('Matched card lookup')
      
      lookupCardByMessage(text)
        .then( renderListOfCards )
        .then( sendToChannel )      
    }
    
    return ""
  },
}

module.exports = handlers;