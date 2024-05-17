export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const ourCards = gameState.players[gameState.in_action].hole_cards
    const communityCards = gameState.community_cards
    const allCards = [...ourCards, ...communityCards]

    let isHighCards = false
    ourCards.forEach((card: any) => {
      if (['A', 'K', 'Q', 'J', '10'].includes(card.rank)) {
        isHighCards = true
      }
    })

    let hasPair = false
    const cardRanks = allCards.map((card: any) => card.rank)
    const uniqueCardRanks = new Set(cardRanks)
    hasPair = uniqueCardRanks.size !== cardRanks.length

    const betToCall = gameState.current_buy_in - gameState.players[gameState.in_action].bet
    const betToRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise

    if (communityCards.length === 0) {
      // Before flop
      if (hasPair || isHighCards) {
        betCallback(betToRaise)
      } else {
        betCallback(0)
      }
    } else if (communityCards.length === 3) {
      // Flop
      if (hasPair || isHighCards) {
        betCallback(betToRaise)
      } else {
        betCallback(betToCall)
      }
    } else if (communityCards.length === 4) {
      // Turn
      if (hasPair || isHighCards) {
        betCallback(betToRaise)
      } else {
        betCallback(betToCall)
      }
    } else if (communityCards.length === 5) {
      // River
      if (hasPair || isHighCards) {
        betCallback(betToRaise)
      } else {
        betCallback(betToCall)
      }
    }
  }

  public showdown(gameState: any): void {
    // called at the end of each round
  }
}

export default Player
