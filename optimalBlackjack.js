const insurancePayout = 3 // 2 to 1 payout
const cards = new Map([["A", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8], ["9", 9], ["10", 10], ["J", 10], ["Q", 10], ["K", 10]]);

// playerCards is an array of cards, with values 2-10 and J, Q, K, A
// dealerCard is a single value from 2-10, J, Q, K, A
function getOptimalAction(playerCards, dealerCard) {
}

function totalHand(playerCards) {
    var handValue = {total: 0, soft: false};
    var hasAce = false;
    for (let i = 0; i < playerCards.length; i++) {
        handValue.total += cards.get(playerCards[i]);
        if (playerCards[i] === "A") {
            hasAce = true;
        }
    }
    if (hasAce && handValue.total <= 11) {
        handValue.total += 10;
        handValue.soft = true;
    }
    console.log(handValue);
    return handValue;
}

function shouldPlayerSplit(playerCards, dealerCard) {
    switch (playerCards[0]) {
        case "2":
            return;
    }
}

function takeInsurance() {
    // Fair payout for insurance in infinite cards is 3.25 (1/(16/52)).
    // Since almost all casinos pay 2 to 1, insurance is never worth it and has a house edge of 7.69%.
    // With a fair payout, it may be worth it to take insurance to reduce variance. However, it has no effect on EV.
    if (insurancePayout > 3.25) {
        return true;
    } else {
        return false;
    }
}