const fetch = require("node-fetch")
const querystring = require('querystring')
const mtgapi_url = "https://api.magicthegathering.io/v1"
const mtgapi_url_cards = mtgapi_url + "/cards?"
const mtgapi_url_sets = mtgapi_url + "/sets/"

const lookupPackOfCardsBySet = set => {
  console.log('Making mtgapi request to get pack of ' + set)
  console.log(mtgapi_url_sets + set + "/booster")
  
  return fetch(mtgapi_url_sets + set + "/booster")
    .then(response => response.json())
    .then(data => {
      const cards = data.cards
      return cards
    })
}

const lookupCardByMessage = text => {
  var query_params = {
    pageSize: 2, 
    name: text.slice(1),
    layout: "normal|split|flip|double-faced|leveler|aftermath"
  }
  
  var params = querystring.stringify(query_params);
  console.log('Making mtgapi request')
  console.log(params)
  console.log(mtgapi_url_cards + params)
  
  return fetch(mtgapi_url_cards + params)
    .then(response => response.json())
    .then(data => {
      var firstCard = data.cards[0]
      const cards = [firstCard]
      
      if(firstCard.layout === "double-faced" ) {
        if (!firstCard.number.endsWith('a') && !firstCard.number.endsWith('b')){
            firstCard = data.cards[1]
        }
        const otherCardNumber = firstCard.number.endsWith('a') 
            ? firstCard.number.replace('a', 'b') 
            : firstCard.number.replace('b', 'a')
        
        
        return cardLookupBySetNumber({ set: firstCard.set, number: otherCardNumber})
          .then( nextCard => { cards.push(nextCard) } )
          .then(() => cards)
      }
    
      return cards
    })
}

const cardLookupBySetNumber = (options) => {
  const set = options.set
  const number = options.number
  
  const query_params = {
    pageSize: 1, 
    set: set,
    number: number,
    layout: "normal|split|flip|double-faced|leveler|aftermath"
  }
  const params = querystring.stringify(query_params);
  console.log('Making mtgapi request')
  console.log(params)
  console.log(mtgapi_url_cards + params)

  return fetch(mtgapi_url_cards + params)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      return data.cards[0]
    })
}

module.exports = {
  cardLookupBySetNumber,
  lookupCardByMessage,
  lookupPackOfCardsBySet
}