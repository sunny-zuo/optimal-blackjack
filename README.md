# Optimal Blackjack

Javascript module that returns the optimal action for a given blackjack hand, utilizing the [strategy created by Wizard of Odds](https://wizardofodds.com/games/blackjack/expected-return-infinite-deck/) for an infinite deck game.

## Installation

```
npm install optimal-blackjack --save
```

## Usage
```js
const OptimalBlackjack = require('optimal-blackjack');

const Strategy = new OptimalBlackjack(maxHands = 2, resplitAces = false);
Strategy.getAction(playerCards, dealerCard, handCount = 1);
```

The parameters to the constructor are:
* maxHands - maximum number of hands allowed to be played (optional and defaults to 2)
* resplitAces - boolean representing whether or not the player is allowed to resplit aces (optional and defaults to false)

Use the ```getAction``` method to obtain a string suggesting the optimal actions. The parameters are:

* playerCards - array of the card ranks as a string ("10", "A", "5", "K", etc)
* dealerCard - the dealer's card rank as a string
* handCount - number of hands the player has in-play as an integer (optional & defaults to 1)

The return options are ```hit```, ```stand```, ```double``` and ```split```.

**Example Usage:**
```js
const OptimalBlackjack = require('optimal-blackjack');
const Strategy = new OptimalBlackjack();

// Action is "stand"
console.log(Strategy.getAction(["A", "8"], "7"));

// Action is "hit"
console.log(Strategy.getAction(["8", "7"], "K"));

// Action is "double"
console.log(Strategy.getAction(["3", "8"], "2"));

// Action is "split"
console.log(Strategy.getAction(["A", "A"], "J"));
```

There is no ```insurance``` return, as insurance is never worth it when sites offer a 2 to 1 (3x) payout due to the house edge being 7.69%. Insurance becomes a +EV play once the payout becomes larger than 9 to 4 (3.25x), in which case it is always worth it to take insurance. If the payout is exactly 9 to 4, it *may* be worth taking insurance to reduce variance as it has a negative correlation with your main bet.

## Testing

```
npm test
```

```blackjackTest.js``` simulates a given number hands of blackjack, acting according to the optimal actions. After 10 million simulations:
```
The experimental house edge with 1000000000 simulations is 0.5703% with 1032418926 wagered and -5702727 net
```

We get an experimental house edge of 0.5703% per hand, which is about as expected. The ruleset used in the test has an edge of 0.57%. Small differences between the experimental house edge and the actual edge can be attributed to variance, especially with smaller smulation counts.