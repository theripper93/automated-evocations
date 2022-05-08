// flaming sphere
const summon = CompanionManager.api.getSummonInfo(args, 2);
const flamingSphere = {
  sphere: [`${summon.level + 2}d6`, 'fire'],
}
return {
  embedded: {
    Item: {
      "Flaming Sphere": {
        "data.description.value": `Any creature that ends its turn within 5 feet of the sphere, or has the sphere rammed into it, must make a Dexterity saving throw (DC ${summon.dc}). The creature takes ${flamingSphere.sphere[0]} ${flamingSphere.sphere[1]} damage on a failed save, or half as much damage on a successful one.`,
        "data.save.dc": summon.dc,
        "data.damage.parts":[flamingSphere.sphere]
      }
    }
  }
}

//spectral guardian
const summon = CompanionManager.api.getSummonInfo(args, 4);
return {
  embedded: {
    Item: {
      "Guardian of Faith": {
        "data.description.value": `Any creature hostile to you that moves to a space within 10 feet of the guardian for the first time on their turn must succeed on a Dexterity saving throw (DC ${summon.dc}). The creature takes 20 radiant damage on a failed save, or half as much damage on a successful one. The guardian vanishes when it has dealt a total of 60 damage.`,
        "data.save.dc": summon.dc
      }
    }
  }
}

//arcane  sword
const summon = CompanionManager.api.getSummonInfo(args, 7);
return {
  embedded: {
    Item: {
      "Arcane Sword": {
        "data.description.value": `Make a melee spell attack (+${summon.attack.ms}) against a target of your choice within 5 feet of the sword. On a hit, the target takes 3d10 force damage.`,
        "data.attackBonus": summon.attack.ms,
      }
    }
  }
}

//phantom watchdog
const summon = CompanionManager.api.getSummonInfo(args, 4);
return {
  embedded: {
    item: {
      "Bite": {
        "data.description.value": `The hound bites one creature or object within 5 feet of it. The hound's attack bonus is equal to your spellcasting modifier + your proficiency bonus (+${summon.attack.ms}). On a hit, it deals 4d8 piercing damage.`,
        "data.attackBonus": summon.attack.ms,
      }
    }
  }
}

//spiritual weapon
const summon = CompanionManager.api.getSummonInfo(args, 2);
const spiritualWeapon = {
  slash: [`${Math.floor(summon.level / 2) + 1}d8 + ${summon.modifier}`, 'force'],
}

return {
  embedded: {
    Item: {
      "Slash": {
        "data.description.value": `The weapon strikes one creature within 5 feet of it. Make a melee spell attack for the weapon using your game statistics (+${summon.attack.ms}). On a hit, the target takes ${spiritualWeapon.slash[0]} ${spiritualWeapon.slash[1]} damage.`,
        "data.attackBonus": summon.attack.ms,
        "data.damage.parts":[spiritualWeapon.slash]
      }
    }
  }
}

//arcane hand
const summon = CompanionManager.api.getSummonInfo(args, 5);
const arcaneHand = {
  clenchedFist: [`${summon.level * 2 + 4}d8`, 'force'],
  graspingHand: [`${summon.level * 2 + 2}d6 + ${summon.modifier}`, 'bludgeoning'],
}

return {
  actor: {
    "data.attributes.hp.max": summon.maxHP,
    "data.attributes.hp.value": summon.maxHP,
  },
  embedded: {
    Item: {
      "Clenched Fist": {
        "data.description.value": `The hand strikes one creature or object within 5 feet of it. Make a melee spell attack for the hand using your game statistics (+${summon.attack.ms}). On a hit, the target takes ${arcaneHand.clenchedFist[0]} ${arcaneHand.clenchedFist[1]} damage.`,
          "data.attackBonus": summon.attack.ms,
          "data.damage.parts":[arcaneHand.clenchedFist]
      },
      "Grasping Hand":{
        "data.description.value": `The hand attempts to grapple a Huge or smaller creature within 5 feet of it. You use the hand's Strength score to resolve the grapple. If the target is Medium or smaller, you have advantage on the check. While the hand is grappling the target, you can use a bonus action to have the hand crush it. When you do so, the target takes ${arcaneHand.graspingHand[1]} damage equal to ${arcaneHand.graspingHand[0]}.`,
        "data.damage.parts":[arcaneHand.graspingHand]
      }
    }
  }
}