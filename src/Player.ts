export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const ourCards = gameState.players[gameState.in_action].hole_cards
    const communityCards = gameState.community_cards

    let isHighCards = false
    ourCards.forEach((card: any) => {
      if (['A', 'K', 'Q', 'J', '10'].includes(card.rank)) {
        isHighCards = true
      }
    })

    let hasPair = false
    const ourCardRanks = ourCards.map((card: any) => card.rank)
    const uniqueCardRanks = new Set(ourCardRanks)
    hasPair = uniqueCardRanks.size !== ourCardRanks.length

    const betToCall = gameState.current_buy_in - gameState.players[gameState.in_action].bet
    const betToRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise

    if (hasPair) {
      betCallback(betToRaise)
      return
    } else if (isHighCards) {
      betCallback(betToCall)
      return
    } else {
      betCallback(0)
      return
    }
  }

  public showdown(gameState: any): void {
    // called at the end of each round
  }
}

export default Player
