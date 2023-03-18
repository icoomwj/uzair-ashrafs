const fs = require('fs')
const util = require('util')
const p = require('path');
const readdir = util.promisify(fs.readdir);
// const path = p.join(__dirname, '../src/data/details.json')
const weapons = require('../src/data/weapons.json')
const characters = require('../src/data/characters.json')

const run = async () => {
  try {
    const items = [...weapons, ...characters]
    let itemList = `
Weapon
 Skyward Harp
Weapon
 Lost Prayer to the Sacred Winds
Weapon
Amos' Bow
Weapon
Skyward Atlas
Weapon
Primordial Jade Winged-Spear
Weapon
Skyward Spine
Weapon
Wolf's Gravestone
Weapon
Skyward Pride
Weapon
Skyward Blade
Weapon
Aquila Favonia
Weapon
 Alley Hunter
Weapon
 Favonius Codex
Weapon
 Favonius Lance
Weapon
 Sacrificial Greatsword
Weapon
 Favonius Sword
Character
Xinyan
Character
Sucrose
Character
Diona
Character
Chongyun
Character
Noelle
Character
Bennett
Character
Fischl
Character
Ningguang
Character
Xingqiu
Character
Beidou
Character
Xiangling
Character
Razor
Character
Barbara
Weapon
Rust
Weapon
Sacrificial Bow
Weapon
The Stringless
Weapon
Favonius Warbow
Weapon
Eye of Perception
Weapon
Sacrificial Fragments
Weapon
The Widsith
Weapon
Dragon's Bane
Weapon
Rainslasher
Weapon
The Bell
Weapon
Favonius Greatsword
Weapon
Lion's Roar
Weapon
Sacrificial Sword
Weapon
The Flute
Weapon
Slingshot
Weapon
Sharpshooter's Oath
Weapon
Raven Bow
Weapon
Emerald Orb
Weapon
Thrilling Tales of Dragon Slayers
Weapon
Magic Guide
Weapon
Black Tassel
Weapon
Debate Club
Weapon
Bloodtainted Greatsword
Weapon
Ferrous Shadow
Weapon
Skyrider Sword
Weapon
Harbinger of Dawn
Weapon
Cool Steel
    `
    itemList = itemList.split(/\r?\n/).map(s => s.trim()).filter(s => s !== "Character" && s !== "Weapon")
    itemList.pop()
    itemList.shift()
    let newDetails = []
    itemList.forEach(item => {
      newDetails.push(items.find(i => i.name === item))
    })
    newDetails = newDetails.map(item => {
      if(!item) return null
      if(item.hasOwnProperty('class')) {
        if(!item.hasOwnProperty('type')) {
          item.type = 'weapon'
        }
      }
      if(!item.src) {
        item.src = item.name + '.png'
      } else {
        if(item.src.includes("'")) {
          item.src = item.src.replace("'", "")
        }
      }
      return item
    })
    // let epitome = require('../src/data/wanderlust-invocation.json')
    const path = p.join(__dirname, '../src/data/epitome-invocation.json')
    // epitome.forEach(item => {
    //   if(item.hasOwnProperty('class')) {
    //     if(!item.hasOwnProperty('type')) {
    //       item.type = 'weapon'
    //     }
    //   }
    // })
    // console.log(epitome.find(item => item.name === "Dragon's Bane"))
    fs.writeFileSync(path, JSON.stringify(newDetails, null, '\t'))
    console.log(newDetails)
  } catch(err) {
    console.log(err)
  }
}

run()

const validateImages = async () => {
  let invitation = require('../src/data/farewell-of-snezhnaya-2.json')
  let wanderlust = require('../src/data/wanderlust-invocation.json')
  let epitome = require('../src/data/epitome-invocation.json')
  const weaponPix = await readdir(p.join(__dirname, '../src/assets/images/weapons'))
  const characterPix = await readdir(p.join(__dirname, '../src/assets/images/characters'))
  const pics = [...weaponPix, ...characterPix]
  const arrs = [invitation, wanderlust, epitome]
  arrs.forEach((arr, i) => {
    arr.forEach(item => {
      if (!pics.some(pic => pic === item.src)) {
        console.log(`We are missing an image for ${item.name} from the banner in the ${i} position`)
      }
    })
  })
}

// validateImages()
