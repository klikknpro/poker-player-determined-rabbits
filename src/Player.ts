export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const ourCards = gameState.players[gameState.in_action].hole_cards
    const communityCards = gameState.community_cards
    const allCards = [...ourCards, ...communityCards]

    let isHighCards = false
    const ourHighCards = []
    ourCards.forEach((card: any) => {
      if (['A', 'K', 'Q', 'J', '10'].includes(card.rank)) {
        ourHighCards.push(card)
        isHighCards = true
      }
    })

    let hasPair = false
    const cardRanks = allCards.map((card: any) => card.rank)
    const uniqueCardRanks = new Set(cardRanks)
    hasPair = uniqueCardRanks.size !== cardRanks.length

    // const checkForHighPair = () => {
    // }

    const betToCall = gameState.current_buy_in - gameState.players[gameState.in_action].bet
    const betToRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise
    const betAllIn = gameState.players[gameState.in_action].stack

    if (hasPair && isHighCards) {
      betCallback(betAllIn)
      return
    }

    if (communityCards.length === 0) {
      // Before flop
      if (hasPair || isHighCards) {
        betCallback(betToCall)
      } else {
        betCallback(0)
      }
    } else if (communityCards.length === 3) {
      // Flop
      if (hasPair) {
        betCallback(betToRaise)
      } else if (isHighCards) {
        betCallback(betToCall)
      } else {
        betCallback(0)
      }
    } else if (communityCards.length === 4) {
      // Turn
      if (hasPair || isHighCards) {
        betCallback(betToRaise)
      } else {
        betCallback(0)
      }
    } else if (communityCards.length === 5) {
      // River
      if (hasPair || isHighCards) {
        betCallback(betToRaise)
      } else {
        betCallback(0)
      }
    }
  }

  public showdown(gameState: any): void {
    // called at the end of each round
  }
}

export default Player
