# Automated Evocations
A user interface to manage companions with summoning animations and automated summoning for spells

![Latest Release Download Count](https://img.shields.io/github/downloads/theripper93/Levels/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Flevels&colorB=03ff1c&style=for-the-badge)](https://forge-vtt.com/bazaar#package=levels) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ftheripper93%2FLevels%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge) [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/theripper93) [![alt-text](https://img.shields.io/badge/-Discord-%235662f6?style=for-the-badge)](https://discord.gg/F53gBjR97G)

# How to use

## Companion Manager

Open any character sheet, in the header of the window you will see the companions button
![image](https://user-images.githubusercontent.com/1346839/130644498-3b14fe5d-79ff-489c-8593-ea61f2d9f752.png)

Upon opening you will be welcomed by a window, from here you can drag and drop actor into it to add them.

After adding actor to the window you will have some options:

- To summon click on the actor image, you will get a placement croshair, just click where you want to summon the token
- The number field represents how many tokens you will spawn
- The dropdown will let you chose the summoning animation

![image](https://user-images.githubusercontent.com/1346839/130645621-2da0dcd2-bd7f-4599-bfb7-712441734aef.png)

## Custom Macros (requires the Advanced Macro Module)

You can assign cusom macros to specific actors

1. Create a macro with this exact name `AE_Companion_Macro(ActorName)` eg. `AE_Companion_Macro(Bat)`, this will get fired any time a creature with that name is summoned
2. Add code for the custom data, in the context of the macro args[0] contains the following data: 

`summon`: the actor that's getting summoned

`spellLevel`: the level of the spell that triggered the summoning (requires midiqol)

`duplicates`: how many creatures are getting summoned

`assignedActor`: the actor assigned to the player doing the summoning (this will be the selected token actor if no assigned actor is found, this is always the case for GMs)

The macro must return the custom data.

Example (Arcane Hand auto scaling)

Macro name: `AE_Companion_Macro(Arcane Hand)`

```js
return {
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
```

Every time an actor named `Arcane Hand` is summoned, the custom data will be applied

# Credits \ License

## Jack Kerouac's

The included assets are from Jack Kerouac's amazing https://github.com/jackkerouac/animated-spell-effects-cartoon module.

## Sequencer

This module is used to play the animations https://github.com/fantasycalendar/FoundryVTT-Sequencer

## Warpgate

This module is used for the spawning https://github.com/trioderegion/warpgate












