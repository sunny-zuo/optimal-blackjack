/* Assumed Rules:
 * Infinite Decks
 * Dealer Stands on Soft 17
 * Double After Split
 * Double on Any First Two Cards
 * Can resplit Aces
 * Can't hit split Aces
 * Lose original bet against dealer BJ
 * No surrender
 */
const insurancePayout = 3; // 2 to 1 payout
const maxSplitHands = 2;
const cards = new Map([["A", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8], ["9", 9], ["10", 10], ["J", 10], ["Q", 10], ["K", 10]]);

// playerCards is an array of cards, with values 2-10 and J, Q, K, A
// dealerCard is a single value from 2-10, J, Q, K, A
function getOptimalAction(playerCards, dealerCard, handCount) {
    let dealerValue = cards.get(dealerCard);
    // Handle pairs (for splits)
    if (shouldPlayerSplit(playerCards, dealerValue, handCount)) {
        return "split";
    }
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
    return handValue;
}

function shouldPlayerSplit(playerCards, dealerValue, handCount) {
    // Check is split is allowed
    if (playerCards.length != 2 || playerCards[0] != playerCards[1] || handCount <= maxSplitHands) {
        return false;
    }

    switch (cards.get(playerCards[0])) {
        case 1:
        case 8:
            // Always split aces and 8s
            return true;
        case 2:
        case 3:
        case 7:
            // Split when dealer less than 8 and not ace
            // Assumes can double after split for 2 and 3
            if (dealerValue < 8 && dealerValue != 1) {
                return true;
            }
            return false;
        case 4:
            // Split when dealer has 5-6
            // Assumes can double after split
            if (dealerValue === 5 || dealerValue === 6) {
                return true;
            }
            return false;
        case 5:
        case 10:
            // Never split 5s or 10s
            return false;
        case 6:
            // Split when dealer less than 7 and not ace
            // Assumes can double after split
            if (dealerValue < 7 && dealerValue != 1) {
                return true;
            }
            return false;
        case 9:
            // Split unless dealer shows 7, 10 or ace
            if (dealerValue != 7 && dealerValue != 10 && dealerValue != 1) {
                return true;
            }
            return false;
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