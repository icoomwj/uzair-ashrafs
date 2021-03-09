import BaseGacha from './base-gacha'
import drops from '../data/ballad-in-goblets.json'
// 5 star item chance 1.6% guaranteed once per 90 attempts
// first time getting 5 star item 50% chance for venti, if not second time 100% venti
// guaranteed to win 4 star item atleast once per 10 roll
// first time winning 4 star item 50% chance for featured character, guaranteed for second time
export default class BalladInGoblets extends BaseGacha {
  constructor() {
    super(drops)
    this.attemptsCount = 0;
    this.guaranteedFeatured4Star = false
    this.guaranteed5Star = false
    this.guaranteedVenti = false
    this.probabilityRange = this.generateProbabilityRange(943, 51, 6)
  }
  set attempts(amount) {
    this.attemptsCount += amount
    if (!(this.attemptsCount % 90)) {
      this.guaranteed5Star = true
    } else {
      this.guaranteed5Star = false
    }
  }
  roll() {
    const roll = []
    this.shuffle(this.probabilityRange)
    this.attempts = 10
    // checks to see if 90 attempts have passed, and grabs 5 star item
    if(this.guaranteed5Star) {
      roll.push(this.getGuaranteed5StarItem())
    }
    // 4 star item or higher guaranteed every 10 rolls
    roll.push(this.getGuaranteed4StarItemOrHigher())

    const rollsToGo = 10 - roll.length

    for(let i = 0; i < rollsToGo; i++) {
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
  getGuaranteed5StarItem() {
    const isVenti = this.flipACoin()
    if(this.guaranteedVenti || isVenti) {
      return this.grabAVenti()
    }
    this.guaranteedVenti = true
    return this.getRandomItem(5)
  }
  getGuaranteed4StarItemOrHigher() {
    // 12% chance of getting 5 star item
    const twelveRandomNumbers = this.generateRandomNumbers(12, 100)
    const randomNumber = this.generateRandomNumber(100)
    const didUserGet5StarItem = twelveRandomNumbers.has(randomNumber)
    if(didUserGet5StarItem) {
      return this.getRandomItem(5)
    }
    const isFeatured4StarCharacter = this.flipACoin()
    if(isFeatured4StarCharacter || this.guaranteedFeatured4Star) {
      return this.getRandomFeatured4StarItem()
    } else {
      this.guaranteedFeatured4Star = true
      return this.getRandomItem(4)
    }

  }
  getRandomFeatured4StarItem() {
    const items = this.getDrops(4)
    const featuredItems = items.filter(item => item.rating === 4 && item.isFeatured === true)
    return featuredItems[this.generateRandomNumber(featuredItems.length)]
  }
  grabAVenti() {
    this.guaranteedVenti = false
    return this.drops.find(item => item.name === 'Venti')
  }
}
