//spectral guardian

return {
    embedded: {
        Item: {
            "Guardian of Faith": {
                "data.save.dc": args[0].assignedActor?.data.data.attributes.spelldc || 10
            }
        }
    }
  }

//arcane  sword

return {
    embedded: {
        Item: {
            "Arcane Sword": {
            "data.attackBonus": args[0].assignedActor?.data.data.attributes.spelldc-8+args[0].assignedActor?.data.data.bonuses.msak.attack
            }
        }
    }
  }

//phantom watchdog

return {
    embedded: {
        item: {
            "Bite": {
                "data.attackBonus": args[0].assignedActor?.data.data.attributes.spelldc-8+args[0].assignedActor?.data.data.bonuses.msak.attack
            }
        }
    }
  }

//spiritual weapon

return {
  embedded: {
      Item: {
    "Slash": {
      "data.attackBonus": args[0].assignedActor?.data.data.attributes.spelldc-8+args[0].assignedActor?.data.data.bonuses.msak.attack,
      "data.damage.parts":[[`${1 + Math.floor((args[0].spellLevel-2)/2)}d8 + ${args[0].assignedActor?.data.data.abilities[args[0].assignedActor?.data.data.attributes.spellcasting]?.mod || ""}`,"force"]]
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