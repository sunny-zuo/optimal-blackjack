import OptimalBlackjack from "./OptimalBlackjack.js";

const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const cardVals = new Map([["A", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8], ["9", 9], ["10", 10], ["J", 10], ["Q", 10], ["K", 10]]);

function runSims() {
    let Strategy = new OptimalBlackjack(2);

    let netProfit = 0;
    let wagered = 0;
    let simCount = 1000000;
    for (let i = 0; i < simCount; i++) {
        let playerHand = [];
        let dealerHand = [getRandomCard(), getRandomCard()];
        playerHand.push([getRandomCard(), getRandomCard()]);

        // Check for player and dealer blackjack
        if (totalHand(dealerHand) === 21) {
            if (totalHand(playerHand[0]) == 21) {
                continue;
            }
            wagered += 1;
            netProfit -= 1;
            continue;
        } else if (totalHand(playerHand[0]) === 21) {
            wagered += 1;
            netProfit += 1.5;
            continue;
        }

        // Get full dealer hand
        while (totalHand(dealerHand) < 17) {
            dealerHand.push(getRandomCard());
        }

        // Check split
        let skipActions = false;
        if (Strategy.getAction(playerHand[0], dealerHand[0], 1) === "split") {
            playerHand[0][1] = getRandomCard();
            playerHand.push([playerHand[0][0], getRandomCard()]);
            if (playerHand[0][0] === "A") {
                skipActions = true;
            }
        }

        // Continue doing actions
        checkHands:
        for (let j = 0; j < playerHand.length; j++) {
            let action = skipActions ? "stand" : " ";
            let betSize = 1;
            while (action != "stand") {
                action = Strategy.getAction(playerHand[j], dealerHand[0], playerHand.length);
                switch (action) {
                    case "double":
                        betSize *= 2;
                        playerHand[j].push(getRandomCard());
                        action = "stand";
                        break;
                    case "hit":
                        playerHand[j].push(getRandomCard());
                        break;
                    case "stand":
                        action = "stand";
                }
                if (totalHand(playerHand[j]) > 21) {
                    break;
                }
            }
            //console.log(`Player bet ${betSize} with hand: ${JSON.stringify(playerHand[j])} (${totalHand(playerHand[j])}), Dealer Hand: ${JSON.stringify(dealerHand)} (${totalHand(dealerHand)})`);
            // Check against dealer hand
            if (totalHand(playerHand[j]) > 21) {
                netProfit -= betSize;
                wagered += betSize;
                continue;
            }
            else if (totalHand(dealerHand) > 21) {
                netProfit += betSize;
                wagered += betSize;
                continue;
            } 
            if (totalHand(dealerHand) > totalHand(playerHand[j])) {
                netProfit -= betSize;
                wagered += betSize;
                continue;
            } else if (totalHand(dealerHand) === totalHand(playerHand[j])) {
                continue;
            } else {
                netProfit += betSize;
                wagered += betSize;
                continue;
            }
        }
    }
    console.log(`The experimental house edge with ${simCount} simulations is ${-(netProfit/simCount*100).toFixed(4)}% with ${wagered} wagered and ${netProfit} net.\nThe expected edge is 0.57%, which should be fairly close to the experimental house edge. Increase the simulation count to reduce variance and get closer to the expected value.`);
}


function getRandomCard() {
    return cards[Math.floor(Math.random() * 13)];
}

function totalHand(allCards) {
    let handValue = 0;
    let hasAce = false;
    for (let i = 0; i < allCards.length; i++) {
        handValue += cardVals.get(allCards[i]);
        if (allCards[i] === "A") {
            hasAce = true;
        }
    }
    if (hasAce && handValue <= 11) {
        handValue += 10;
    }
    return handValue;
}

runSims();