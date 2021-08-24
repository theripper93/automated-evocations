Hooks.once("ready", async function () {
  if (!game.automatedevocations) {
    game.automatedevocations = {};
  }

  game.automatedevocations.dnd5e = {
    "Arcane Hand":[
      {
        creature: "Arcane Hand",
        number: 1,
      },
    ],
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
    },
    "Find Familiar": [
      {
        creature: "Bat",
        number: 1,
      },
      {
        creature: "Cat",
        number: 1,
      },
      {
        creature: "Crab",
        number: 1,
      },
      {
        creature: "Frog",
        number: 1,
      },
      {
        creature: "Hawk",
        number: 1,
      },
      {
        creature: "Lizard",
        number: 1,
      },
      {
        creature: "Octopus",
        number: 1,
      },
      {
        creature: "Owl",
        number: 1,
      },
      {
        creature: "Poisonous Snake",
        number: 1,
      },
      {
        creature: "Quipper",
        number: 1,
      },
      {
        creature: "Rat",
        number: 1,
      },
      {
        creature: "Raven",
        number: 1,
      },
      {
        creature: "Sea Horse",
        number: 1,
      },
      {
        creature: "Spider",
        number: 1,
      },
      {
        creature: "Weasel",
        number: 1,
      },
    ],
  };
});


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