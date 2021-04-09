import BaseGacha from './base-gacha'
import drops from '../data/beginners-wish.json'

export default class BeginnersWish extends BaseGacha {
  constructor(setBeginnersWishDisable = () => {}) {
    super(drops)
    this.attemptsCount = 0;
    this.guaranteedNoelle = true
    this.probabilityRange = this.generateProbabilityRange(943, 51, 6)
    this.setBeginnersWishDisable = setBeginnersWishDisable
  }
  set attempts(amount) {
    this.attemptsCount += amount
    if(this.attemptsCount === 20) {
      console.log('do it')
      this.setBeginnersWishDisable(true)
    }
  }
  roll() {
    // Beginners wish is limited to 20 rolls
    if(this.attemptsCount === 20) {
      console.error('Exceed beginners wish limit')
      return null;
    }
    const roll = []
    this.shuffle(this.probabilityRange)
    this.attempts = 10
    if (this.guaranteedNoelle) {
      roll.push(this.grabANoelle())
      this.guaranteedNoelle = false
    } else {
      roll.push(this.getGuaranteed4StarItemOrHigher())
    }
    // 4 star item or higher guaranteed every 10 rolls

    const rollsToGo = 10 - roll.length

    for (let i = 0; i < rollsToGo; i++) {
      roll.push(this.rollBasedOffProbability())
    }
    return roll
  }
  rollBasedOffProbability() {
    const itemRating = this.probabilityRange[this.generateRandomNumber(this.probabilityRange.length)]
    return this.getRandomItem(itemRating)
  }
  getRandomItem(rating) {
    const itemsList = this.getDrops(rating)
    const item = itemsList[this.generateRandomNumber(itemsList.length)]
    return item
  }
  getGuaranteed4StarItemOrHigher() {
    // 12% chance of getting 5 star item
    const twelveRandomNumbers = this.generateRandomNumbers(12, 100)
    const randomNumber = this.generateRandomNumber(100)
    const didUserGet5StarItem = twelveRandomNumbers.has(randomNumber)
    if (didUserGet5StarItem) {
      return this.getRandomItem(5)
    }
      return this.getRandomItem(4)
  }
  grabANoelle() {
    return {
      name: "Noelle",
      element: "Geo",
      type: "character",
      rating: 4,
      src: "Noelle.png"
    }
  }
}
