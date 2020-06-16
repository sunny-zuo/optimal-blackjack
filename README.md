# Optimal Blackjack

Javascript module that returns the optimal action for a given blackjack hand, utilizing the [strategy created by Wizard of Odds](https://wizardofodds.com/games/blackjack/expected-return-infinite-deck/). It assumes the following rules:

* Infinite decks
* Dealer stands on soft 17
* Player can double after split
* Player can double on any first two cards
* Player can split to 2 (default) hands maximum (customizable)
* Player can resplit aces
* Player loses only original bet vs dealer BJ
* No surrender

## Usage

optimalBlackjack.js exposes the function ```getOptimalAction``` which will return a string with the optimal action for the hand. The possible return values are ```split```, ```double```, ```hit``` or ```stand```.

The function takes 3 arguments:
```
getOptimalAction(playerCards, dealerCard, handCount)
```

* playerCards - array of the card ranks as a string ("10", "A", "5", "K", etc)
* dealerCard - the dealer's card rank as a string
* handCount - number of hands the player has in-play as an integer

Example Usage:
```
const OptimalBlackjack = require("./optimalBlackjack.js");
// The optimal action is to stand with a soft 18 vs 8
OptimalBlackjack.getOptimalAction(["A", "7"], "8", 1)
```

There is no ```insurance``` return, as insurance is never worth it when sites offer a 2 to 1 (3x) payout due to the house edge being 7.69%. Insurance becomes a +EV play once the payout becomes larger than 9 to 4 (3.25x), in which case it is always worth it to take insurance. If the payout is exactly 9 to 4, it *may* be worth taking insurance to reduce variance as it has a negative correlation with your main bet.

## Testing

I wrote ```blackjackTest.js``` to test the module to ensure that all correct strategy was followed. After 10 million simulations:
```
The experimental house edge with 1000000000 simulations is 0.5524% with 1032418926 wagered and -5702727 net
```

We get an experimental house edge of 0.5524% per wager and a house edge of 0.5703% per hand, which is about as expected.