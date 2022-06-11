import BaseGacha from './base-gacha'
import drops from '../data/gentry-of-hermitage.json'

export default class GentryOfHermitage extends BaseGacha {
  constructor() {
    super(drops)
    this.guaranteed5Star = false
    this.guaranteedZhongli = false
    this.probabilityRange = this.generateProbabilityRange(943, 51, 6)
  }
  getRandomItem(rating) {
    const itemsList = this.getDrops(rating);
    let item;
    if (rating === 5) {
      this.reset5StarProbability()
    }

    if (this.guaranteedZhongli && rating === 5) {
      return this.grabAZhongli();
    } else {
      item = itemsList[this.generateRandomNumber(itemsList.length)];
    }

    if (item.rating === 5 && item.name !== 'Zhongli') {
      this.guaranteedZhongli = true;
    }
    return item
  }
  getGuaranteed5StarItem() {
    const isZhongli = this.flipACoin()
    if (this.guaranteedZhongli || isZhongli) {
      return this.grabAZhongli()
    }
    return this.getRandomItem(5)
  }
  getGuaranteed4StarItemOrHigher() {
    // .5% chance of getting 5 star item
    const itemRating = this.getRandomRating()
    const didUserGet5StarItem = itemRating === 5
    if (didUserGet5StarItem) {
      return this.getRandomItem(5)
    }
    const isFeatured4StarCharacter = this.flipACoin()
    if (isFeatured4StarCharacter || this.guaranteedFeatured4Star) {
      this.guaranteedFeatured4Star = false
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
  grabAZhongli() {
    this.guaranteedZhongli = false
    this.reset5StarProbability()
    return this.drops.find(item => item.name === 'Zhongli')
  }
}
