type Card = {
  rank: number; // 2-14 (where 11 = J, 12 = Q, 13 = K, 14 = A)
  suit: number; // 0-3 (0 = clubs, 1 = diamonds, 2 = hearts, 3 = spades)
};

enum Hand {
  HighCard,
  OnePair,
  TwoPairs,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalFlush,
}

function rankToNumber(rank: string): number {
  switch (rank) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 11;
    default:
      return parseInt(rank, 10);
  }
}

function suitToNumber(suit: string): number {
  switch (suit) {
    case "clubs":
      return 0;
    case "diamonds":
      return 1;
    case "hearts":
      return 2;
    case "spades":
      return 3;
    default:
      throw new Error("Invalid suit");
  }
}

function cardStringToCard(cardString: string): Card {
  return {
    rank: rankToNumber(cardString.slice(0, -1)),
    suit: suitToNumber(cardString.slice(-1)),
  };
}

function handRank(cardStrings: [string, string, string, string, string]): Hand {
  const cards: Card[] = cardStrings.map(cardStringToCard);

  const countBySuit = new Array(4).fill(0);
  const countByRank = new Array(15).fill(0);
  const countBySet = new Array(5).fill(0);

  cards.forEach((card) => {
    countByRank[card.rank]++;
    countBySuit[card.suit]++;
  });

  countByRank.forEach((count) => count && countBySet[count]++);

  // Count Ace as 14 for straights
  countByRank[14] = countByRank[1];

  if (countBySet[4] === 1 && countBySet[1] === 1) return Hand.FourOfAKind;
  if (countBySet[3] && countBySet[2] === 1) return Hand.FullHouse;
  if (countBySet[3] && countBySet[1] === 2) return Hand.ThreeOfAKind;
  if (countBySet[2] === 2 && countBySet[1] === 1) return Hand.TwoPairs;
  if (countBySet[2] === 1 && countBySet[1] === 3) return Hand.OnePair;
  if (countBySet[1] === 5) {
    if (countByRank.join("").includes("11111"))
      return countBySuit.includes(5)
        ? countByRank.slice(10).join("") === "11111"
          ? Hand.RoyalFlush
          : Hand.StraightFlush
        : Hand.Straight;
    else return countBySuit.includes(5) ? Hand.Flush : Hand.HighCard;
  } else {
    throw new Error("Unknown hand! This cannot happen! Bad logic!");
  }
}

function combinations(arr: string[], k: number): string[][] {
  const result: string[][] = [];
  const combo: number[] = [];
  (function helper(start: number) {
    if (combo.length === k) {
      result.push(combo.map((i) => arr[i]));
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(i);
      helper(i + 1);
      combo.pop();
    }
  })(0);
  return result;
}

export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const ourPlayer = gameState.players[gameState.in_action];
    const ourCards = ourPlayer.hole_cards.map(
      (card: any) => `${card.rank}${card.suit.charAt(0).toUpperCase()}`
    );
    const communityCards = gameState.community_cards.map(
      (card: any) => `${card.rank}${card.suit.charAt(0).toUpperCase()}`
    );
    const allCards = [...ourCards, ...communityCards];

    let bestHand = Hand.HighCard;

    if (allCards.length >= 5) {
      const allCombinations = combinations(allCards, 5);
      const handRanks = allCombinations.map((handCombo) =>
        handRank(handCombo as [string, string, string, string, string])
      );
      bestHand = Math.max(...handRanks);
    }

    const betToCall = gameState.current_buy_in - ourPlayer.bet;
    const betToRaise = betToCall + gameState.minimum_raise;

    // Example betting strategy based on best hand rank
    if (bestHand >= Hand.StraightFlush) {
      betCallback(ourPlayer.stack); // All-in for very strong hands
    } else if (bestHand >= Hand.ThreeOfAKind) {
      betCallback(betToRaise); // Raise for strong hands
    } else if (bestHand >= Hand.OnePair) {
      betCallback(betToCall); // Call for decent hands
    } else {
      betCallback(0); // Fold for weak hands
    }
  }

  public showdown(gameState: any): void {
    // Placeholder for future learning or adjustments after showdown
  }
}

export default Player;

// export class Player {
//   public betRequest(gameState: any, betCallback: (bet: number) => void): void {
//     const ourCards = gameState.players[gameState.in_action].hole_cards
//     const communityCards = gameState.community_cards
//     const allCards = [...ourCards, ...communityCards]

//     let isHighCards = false
//     const ourHighCards = []
//     ourCards.forEach((card: any) => {
//       if (['A', 'K', 'Q', 'J', '10'].includes(card.rank)) {
//         ourHighCards.push(card)
//         isHighCards = true
//       }
//     })

//     let hasPair = false
//     const cardRanks = allCards.map((card: any) => card.rank)
//     const uniqueCardRanks = new Set(cardRanks)
//     hasPair = uniqueCardRanks.size !== cardRanks.length

//     // const checkForHighPair = () => {
//     // }

//     const betToCall = gameState.current_buy_in - gameState.players[gameState.in_action].bet
//     const betToRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise
//     const betAllIn = gameState.players[gameState.in_action].stack

//     if (hasPair && isHighCards) {
//       betCallback(betAllIn)
//       return
//     }

//     if (communityCards.length === 0) {
//       // Before flop
//       if (hasPair || isHighCards) {
//         betCallback(betToCall)
//       } else {
//         betCallback(0)
//       }
//     } else if (communityCards.length === 3) {
//       // Flop
//       if (hasPair) {
//         betCallback(betToRaise)
//       } else if (isHighCards) {
//         betCallback(betToCall)
//       } else {
//         betCallback(0)
//       }
//     } else if (communityCards.length === 4) {
//       // Turn
//       if (hasPair || isHighCards) {
//         betCallback(betToRaise)
//       } else {
//         betCallback(0)
//       }
//     } else if (communityCards.length === 5) {
//       // River
//       if (hasPair || isHighCards) {
//         betCallback(betToRaise)
//       } else {
//         betCallback(0)
//       }
//     }
//   }

//   public showdown(gameState: any): void {
//     // called at the end of each round
//   }
// }

// export default Player
