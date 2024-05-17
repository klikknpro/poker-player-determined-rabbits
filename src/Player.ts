export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    type Card = {
      rank: string
      suit: string
    }

    const ourCards: Card[] = gameState.players[gameState.in_action].hole_cards
    const communityCards: Card[] = gameState.community_cards
    const allCards = [...ourCards, ...communityCards]

    let isHighCards = false
    ourCards.forEach((card: any) => {
      if (['A', 'K', 'Q', 'J'].includes(card.rank)) {
        isHighCards = true
      }
    })

    let hasPair = false
    const cardRanks = allCards.map((card: any) => card.rank)
    const uniqueCardRanks = new Set(cardRanks)
    hasPair = uniqueCardRanks.size !== cardRanks.length

    function isThreeOfAKind(): boolean {
      const rankCounts = { [ourCards[0].rank]: 1, [ourCards[1].rank]: 1 }

      communityCards.forEach((card) => {
        rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1
      })

      return Object.values(rankCounts).includes(3)
    }
    const hasThreeOfAKind = isThreeOfAKind()

    const checkForFlush = () => {
      const suits: string[] = []
      for (const card of allCards) {
        suits.push(card.suit)
      }
      const suitCounts: { [suit: string]: number } = {}
      for (const suit of suits) {
        if (suitCounts[suit]) {
          suitCounts[suit]++
        } else {
          suitCounts[suit] = 1
        }
      }
      const counts = Object.values(suitCounts)
      for (const count of counts) {
        if (count === 5) {
          return true
        }
      }
      return false
    }
    const hasFlush = checkForFlush()

    const betToCall = gameState.current_buy_in - gameState.players[gameState.in_action].bet
    const betToRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise
    const betAllIn = gameState.players[gameState.in_action].stack

    let gamePhase = 'pre-flop'
    if (communityCards.length === 3) {
      gamePhase = 'flop'
    } else if (communityCards.length === 4) {
      gamePhase = 'turn'
    } else if (communityCards.length === 5) {
      gamePhase = 'river'
    }

    interface PlayHandProps {
      hasPair: boolean
      isHighCards: boolean
      gamePhase: string
      ourCards?: any[]
      allCards?: any[]
      betToCall: number
      betToRaise: number
      betAllIn: number
    }

    const playHand = (props: PlayHandProps) => {
      const { hasPair, isHighCards, gamePhase, betToCall, betToRaise, betAllIn } = props

      if (gamePhase === 'pre-flop') {
        if (hasPair || isHighCards) {
          const lower = Math.round(Math.min(betToCall, betAllIn * 0.3))
          betCallback(lower)
        } else {
          betCallback(0)
        }
      } else if (gamePhase === 'flop') {
        if (hasPair || hasThreeOfAKind || hasFlush) {
          const lower = Math.round(Math.min(betToRaise, betAllIn))
          betCallback(lower)
        } else {
          betCallback(0)
        }
      } else if (gamePhase === 'turn') {
        if (hasPair || hasThreeOfAKind || hasFlush) {
          const lower = Math.round(Math.min(betToRaise, betAllIn))
          betCallback(lower)
        } else if (isHighCards) {
          const lower = Math.round(Math.min(betToCall, betAllIn))
          betCallback(lower)
        } else {
          betCallback(0)
        }
      } else {
        if (hasPair || hasThreeOfAKind || hasFlush) {
          const lower = Math.round(Math.min(betToRaise, betAllIn))
          betCallback(lower)
        } else {
          betCallback(0)
        }
      }
    }
    playHand({ hasPair, isHighCards, gamePhase, betToCall, betToRaise, betAllIn })

    // if (hasPair && isHighCards) {
    //   betCallback(betAllIn)
    //   return
    // }

    // if (communityCards.length === 0) {
    //   // Before flop
    //   if (hasPair || isHighCards) {
    //     betCallback(betToCall)
    //   } else {
    //     betCallback(0)
    //   }
    // } else if (communityCards.length === 3) {
    //   // Flop
    //   if (hasPair) {
    //     betCallback(betToRaise)
    //   } else if (isHighCards) {
    //     betCallback(betToCall)
    //   } else {
    //     betCallback(0)
    //   }
    // } else if (communityCards.length === 4) {
    //   // Turn
    //   if (hasPair || isHighCards) {
    //     betCallback(betToRaise)
    //   } else {
    //     betCallback(0)
    //   }
    // } else if (communityCards.length === 5) {
    //   // River
    //   if (hasPair || isHighCards) {
    //     betCallback(betToRaise)
    //   } else {
    //     betCallback(0)
    //   }
    // }
  }

  public showdown(gameState: any): void {
    // called at the end of each round
  }
}

export default Player
