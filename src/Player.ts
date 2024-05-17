export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    // console.log('gameState', gameState)
    const betToCall = gameState.current_buy_in - gameState.players[gameState.in_action].bet
    betCallback(betToCall)
  }

  public showdown(gameState: any): void {
    // called at the end of each round
  }
}

export default Player
