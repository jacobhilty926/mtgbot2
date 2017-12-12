const cmcToEmoji = text => {
  if (text === undefined) {
    return ""
  }

  return text.replace(/\{([wubrgxc])\}/gi, ":mana$1:")
    .replace(/\{t\}/gi, ":tap:")
    .replace(/\{q\}/gi, ":untap:")
    .replace(/\{([0-9]+)\}/gi, ":mana$1:")
}

const renderCard = (card) => {
  // Build our response body
  const pt = card.power ? '\u00AD' + card.power + "/" + card.toughness + '\u00AD': ""
  const loyalty = card.loyalty ? "Loyalty: " + card.loyalty : ""
  const link = "https://magiccards.info/query?q=" + card.name.replace(" ", "%20")
  const nameLink = "<"+ link + "|" + card.name +">"
  const cost = cmcToEmoji(card.manaCost)
  const oracleText = cmcToEmoji(card.text) 

  return "Name: " + nameLink + "\t\t\tCost: " + cost +
    "\nType: " + card.type + "\t\t\t\t\t" + card.rarity +
    "\n" + oracleText + 
    "\n" + pt + loyalty
}

const renderListOfCards = (cardList, delimiter) => {
  console.log('rendering list')
  delimiter = delimiter || "\n---------------------------\n"
  return cardList.map(renderCard).join(delimiter)
}

module.exports = {
  renderCard,
  renderListOfCards,
  cmcToEmoji
}