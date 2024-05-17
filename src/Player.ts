export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const ourCards = gameState.players[gameState.in_action].hole_cards
    let isHighCards = false
    ourCards.forEach((card: any) => {
      if (card.rank === 'A' || card.rank === 'K' || card.rank === 'Q' || card.rank === 'J' || card.rank === '10') {
        isHighCards = true
      }
    })

    const betToCall = gameState.current_buy_in - gameState.players[gameState.in_action].bet
    const betToRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise

    betCallback(isHighCards ? betToRaise : betToCall)
  }

  public showdown(gameState: any): void {
    // called at the end of each round
  }
}

export default Player
