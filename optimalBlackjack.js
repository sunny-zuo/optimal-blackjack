let maxHands;
let resplitAces;
const cards = new Map([["A", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8], ["9", 9], ["10", 10], ["J", 10], ["Q", 10], ["K", 10]]);

function OptimalBlackjack(maxHands = 2, resplitAces = false) {
    this.maxHands = maxHands;
    this.resplitAces = resplitAces;
}
// playerCards is an array of cards, with values 2-10 and J, Q, K, A
// dealerCard is a single value from 2-10, J, Q, K, A
OptimalBlackjack.prototype.getAction = function getAction(playerCards, dealerCard, handCount = 1) {
    const dealerValue = cards.get(dealerCard);
    const playerValue = totalHand(playerCards);

    if (shouldPlayerSplit(playerCards, dealerValue, handCount, this.maxHands, this.resplitAces)) {
        return "split";
    }
    else if (shouldPlayerDouble(playerCards, playerValue, dealerValue)) {
        return "double";
    }
    else if (shouldPlayerStand(playerValue, dealerValue)) {
        return "stand";
    }
    else if (shouldPlayerHit(playerValue, dealerValue)) {
        return "hit";
    }
    else {
        console.log(`Player Hand: ${JSON.stringify(playerCards)}, Dealer Card: ${dealerCard}`);
        throw new Error("No action was found");
    }
}

function totalHand(playerCards) {
    let handValue = { total: 0, soft: false };
    let hasAce = false;
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

function shouldPlayerSplit(playerCards, dealerValue, handCount, maxHands, resplitAces) {
    // Check is split is allowed
    if (playerCards.length != 2 || playerCards[0] != playerCards[1] || handCount >= maxHands) {
        return false;
    }

    switch (cards.get(playerCards[0])) {
        // Always split aces and 8s when allowed
        case 1:
            if (resplitAces || handCount === 1) {
                return true;
            }
            return false;
        case 8:
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

function shouldPlayerDouble(playerCards, playerValue, dealerValue) {
    if (playerCards.length != 2) {
        // Can double only on any first two
        return false;
    }
    if (playerValue.soft) {
        switch (playerValue.total) {
            case 13:
                if (dealerValue === 6) { return true; }
                return false;
            case 14:
            case 15:
                if (5 <= dealerValue && dealerValue <= 6) { return true; }
                return false;
            case 16:
                if (4 <= dealerValue && dealerValue <= 6) { return true; }
                return false;
            case 17:
                if (3 <= dealerValue && dealerValue <= 6) { return true; }
                return false;
            case 18:
                if (2 <= dealerValue && dealerValue <= 6) { return true; }
                return false;
            default:
                return false;
        }
    } else {
        switch (playerValue.total) {
            case 9:
                if (3 <= dealerValue && dealerValue <= 6) { return true; }
                return false;
            case 10:
                if (2 <= dealerValue && dealerValue <= 9) { return true; }
                return false;
            case 11:
                if (2 <= dealerValue && dealerValue <= 10) { return true; }
                return false;
            default:
                return false;
        }
    }
}

function shouldPlayerStand(playerValue, dealerValue) {
    if (playerValue.soft) {
        switch (playerValue.total) {
            case 18:
                // dealer 3-6 should double if allowed and will be caught by shouldPlayerDouble check first
                if (2 <= dealerValue && dealerValue <= 8) {
                    return true;
                }
                return false;
            case 19:
            case 20:
            case 21:
                return true;
            default:
                return false;
        }
    } else {
        if (playerValue.total >= 17) {
            return true;
        }
        switch (playerValue.total) {
            case 12:
                if (4 <= dealerValue && dealerValue <= 6) { return true; }
                return false;
            case 13:
            case 14:
            case 15:
            case 16:
                if (2 <= dealerValue && dealerValue <= 6) { return true; }
                return false;
            default:
                return false;
        }
    }
}

function shouldPlayerHit(playerValue, dealerValue) {
    if (playerValue.soft) {
        // various dealer cards would cause double to be optimal and will be caught by shouldPlayerDouble first
        if (playerValue.total <= 17) {
            return true;
        }
        else if (playerValue.total === 18) {
            if (dealerValue === 9 || dealerValue === 10 || dealerValue === 1) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    } else {
        // various dealer cards would cause double to be optimal and will be caught by shouldPlayerDouble first
        if (playerValue.total <= 11) {
            return true;
        }
        else if (playerValue.total === 12) {
            if ((1 <= dealerValue && dealerValue <= 3) || (7 <= dealerValue && dealerValue <= 10)) {
                return true;
            } else {
                return false;
            }
        }
        else if (13 <= playerValue.total && playerValue.total <= 16) {
            if ((7 <= dealerValue && dealerValue <= 10) || dealerValue === 1) {
                return true;
            } else {
                return false;
            }
        } else if (playerValue.total >= 17) {
            return false;
        }
    }
}

module.exports = OptimalBlackjack;