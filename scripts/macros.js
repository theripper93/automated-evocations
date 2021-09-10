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

return {
    actor: {
      "data.attributes.hp.max":args[0].assignedActor?.data.data.attributes.hp.max || 1,
      "data.attributes.hp.value":args[0].assignedActor?.data.data.attributes.hp.max || 1,
    },
    embedded: {
        item: {
            "Clenched Fist": {
                "data.attackBonus": args[0].assignedActor?.data.data.attributes.spelldc-8+args[0].assignedActor?.data.data.bonuses.msak.attack,
                "data.damage.parts":[[`${((args[0].spellLevel || 5)-5)*2+4}d8`,"force"]]
            },
            "Grasping Hand":{
                "data.damage.parts":[[`${((args[0].spellLevel || 5)-5)*2+4}d6 + ${args[0].assignedActor?.data.data.abilities[args[0].assignedActor?.data.data.attributes.spellcasting]?.mod || ""}`,"bludgeoning"]]
            }
        }
    }
  }