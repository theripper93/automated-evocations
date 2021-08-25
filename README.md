# Automated Evocations
A user interface to manage companions with summoning animations and automated summoning for spells

![Latest Release Download Count](https://img.shields.io/github/downloads/theripper93/automated-evocations/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fautomated-evocations&colorB=03ff1c&style=for-the-badge)](https://forge-vtt.com/bazaar#package=automated-evocations) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ftheripper93%2Fautomated-evocations%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge) [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/theripper93) [![alt-text](https://img.shields.io/badge/-Discord-%235662f6?style=for-the-badge)](https://discord.gg/F53gBjR97G)

# Attention:

## For the summoning to work you need the actors imported in your world and your players need world level permission to create tokens. For the special spells\actor you can import eveything from both the actor and macro compendiums of Automated Evocations

## While not a Dependency, Advanced Macros is required for the custom summons

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

## Store companions on actor

By default companions are stored per user (so each actor will have the same summon list). If you want a particular actor to have it's own summon list you can use the included macro to switch the actor from global storage to local (on the actor). Simply place a linked actor on the scene, select it and run the macro. Using the other macro to switch it to global again will not wipe the saved companions so setting it to local at a later date will restore the previous list.

For more advanced users you can set the flag with the following command : `actor.setFlag(AECONSTS.MN,"isLocal", false)` (set true\false to enable disable local storage)

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

## Supported spells (automated)

The ever expanding list of spells currently includes:
All the SRD spells for dnd5e, if something is missing let me know

## Custom \ non-SRD spells(ADVANCED)

To add your own settings, you can merge your own configs to the default one. For the data structure please check `game.automatedevocations.dnd5e` in the console (or equivalent for your system.

Once you built the object you wanna merge, simply save it to the hidden game setting  `game.settings.set(AECONSTS.MN, "customautospells", yourData)`

WARNING: Setting this hidden setting will override any previous value, so you want to keep a file with all you custom setting and add to it every time you want to apply it!

Example:

```js
const data = {
  "Giant Insect":[
    {
      creature: "Giant Centipede",
      number: 10,
    },
    {
      creature: "Giant Spider",
      number: 3,
    },
    {
      creature: "Giant Wasp",
      number: 5,
    },
    {
      creature: "Giant Scorpion",
      number: 1,
    },
  ]
}
game.settings.set(AECONSTS.MN, "customautospells", data)
```

The custom creature can also be a function, Example:

```js
const data = {
  "Conjure Animals": (data) => {
    let multiplier = 1;
    if (data.level >= 5) multiplier = 2;
    if (data.level >= 7) multiplier = 3; 
    let beasts = game.actors
      .filter(
        (a) =>
          a.data.data.details.type?.value == "beast" &&
          a.data.data.details.cr <= 2
      )
      .sort((a, b) => {
        return a.data.data.details.cr < b.data.data.details.cr ? 1 : -1;
      });
    let creatures = [];
    for (let beast of beasts) {
      let number = 1;
      const cr = beast.data.data.details.cr;
      if(cr==2) number = 1;
      else if(cr==1) number = 2;
      else if(cr==0.5) number = 4;
      else if(cr<=0.25) number = 8;
      creatures.push({
        creature: beast.name,
        number: number*multiplier,
      });
    }
    return creatures;
  }
}
game.settings.set(AECONSTS.MN, "customautospells", data)
```

*contributions to this list are very welcome, contact me via discord or open a PR to add to the list*

# Credits \ License

## Jack Kerouac's

The included assets are from Jack Kerouac's amazing https://github.com/jackkerouac/animated-spell-effects-cartoon module. (used with permission)

## Sequencer

This module is used to play the animations https://github.com/fantasycalendar/FoundryVTT-Sequencer

## Warpgate

This module is used for the spawning https://github.com/trioderegion/warpgate

## Game Icons

Some images used are from https://game-icons.net/












