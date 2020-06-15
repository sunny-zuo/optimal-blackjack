const insurancePayout = 3 // 2 to 1 payout

function takeInsurance() {
    // Fair payout for insurance in infinite cards is 3.25 (1/(16/52)).
    // Since almost all casinos pay 2 to 1, insurance is never worth it and has a house edge of 7.69%.
    if (insurancePayout > 3.25) {
        return true;
    } else {
        return false;
    }
}