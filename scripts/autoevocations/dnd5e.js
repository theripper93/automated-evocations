Hooks.once("ready", async function () {
  if (!game.automatedevocations) {
    game.automatedevocations = {};
    game.automatedevocations[game.system.id] = {};
  }
 if(game.system.id == "dnd5e"){
  game.automatedevocations.dnd5e = {
    "Arcane Hand":[
      {
        creature: "Arcane Hand",
        number: 1,
      },
    ],
    "Flaming Sphere":[
      {
        creature: "Flaming Sphere",
        number: 1,
      },
    ],
    "Spiritual Weapon":[
      {
        creature: "Spiritual Weapon",
        number: 1,
      },
    ],
    "Guardian of Faith":[
      {
        creature: "Spectral Guardian",
        number: 1,
      },
    ],
    "Faithful Hound":[
      {
        creature: "Phantom Watchdog",
        number: 1,
      },
    ],
    "Find Steed":[
      {
        creature: "Warhorse",
        number: 1,
      },
      {
        creature: "Pony",
        number: 1,
      },
      {
        creature: "Camel",
        number: 1,
      },
      {
        creature: "Elk",
        number: 1,
      },
      {
        creature: "Mastiff",
        number: 1,
      },
    ],
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
    ],
    "Arcane Sword":[
      {
        creature: "Arcane Sword",
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
    "Conjure Celestial": (data) => {
      let celestials = game.actors
        .filter(
          (a) =>
            a.data.data.details.type?.value == "celestial" &&
            a.data.data.details.cr <= 4
        )
        .sort((a, b) => {
          return a.data.data.details.cr < b.data.data.details.cr ? 1 : -1;
        });
      let creatures = [];
      for (let celestial of celestials) {
        creatures.push({
          creature: celestial.name,
          number: 1,
        });
      }
      return creatures;
    },
    "Conjure Elemental": (data) => {
      let elementals = game.actors
        .filter(
          (a) =>
            a.data.data.details.type?.value == "elemental" &&
            a.data.data.details.cr <= data.level
        )
        .sort((a, b) => {
          return a.data.data.details.cr < b.data.data.details.cr ? 1 : -1;
        });
      let creatures = [];
      for (let elemental of elementals) {
        creatures.push({
          creature: elemental.name,
          number: 1,
        });
      }
      return creatures;
    },
    "Conjure Fey": (data) => {
      let feys = game.actors
        .filter(
          (a) =>
            a.data.data.details.type?.value == "fey" &&
            a.data.data.details.cr <= data.level
        )
        .sort((a, b) => {
          return a.data.data.details.cr < b.data.data.details.cr ? 1 : -1;
        });
      let creatures = [];
      for (let fey of feys) {
        creatures.push({
          creature: fey.name,
          number: 1,
        });
      }
      return creatures;
    },
    "Conjure Minor Elementals": (data) => {
      let multiplier = 1;
      if (data.level >= 6) multiplier = 2;
      if (data.level >= 8) multiplier = 3; 
      let elementals = game.actors
        .filter(
          (a) =>
            a.data.data.details.type?.value == "elemental" &&
            a.data.data.details.cr <= 2
        )
        .sort((a, b) => {
          return a.data.data.details.cr < b.data.data.details.cr ? 1 : -1;
        });

      let creatures = [];
      for (let elemental of elementals) {
        let number = 1;
        const cr = elemental.data.data.details.cr;
        if(cr==2) number = 1;
        else if(cr==1) number = 2;
        else if(cr==0.5) number = 4;
        else if(cr<=0.25) number = 8;
        creatures.push({
          creature: elemental.name,
          number: number*multiplier,
        });
      }
      return creatures;
    },
    "Conjure Woodland Beings": (data) => {
      let multiplier = 1;
      if (data.level >= 6) multiplier = 2;
      if (data.level >= 8) multiplier = 3;
      let feys = game.actors
      .filter(
        (a) =>
          a.data.data.details.type?.value == "fey" &&
          a.data.data.details.cr <= data.level
      )
      .sort((a, b) => {
        return a.data.data.details.cr < b.data.data.details.cr ? 1 : -1;
      });
      let creatures = [];
      for (let fey of feys) {
        let number = 1;
        const cr = fey.data.data.details.cr;
        if(cr==2) number = 1;
        else if(cr==1) number = 2;
        else if(cr==0.5) number = 4;
        else if(cr<=0.25) number = 8;
        creatures.push({
          creature: fey.name,
          number: number*multiplier,
        });
      }
      return creatures;
    },
    "Animate Dead": (data) => {
      let multiplier = 1 + (data.level-3)*2;
      return [
        {
          creature: "Skeleton",
          number: multiplier,
        },
        {
          creature: "Zombie",
          number: multiplier,
        }
      ]
    },
    "Create Undead": (data) => {
      let multiplier = data.level-3
      if(data.level == 8){
        return [
          {
            creature: "Ghoul",
            number: 5,
          },
          {
            creature: "Ghast",
            number: 2,
          },
          {
            creature: "Wights",
            number: 2,
          }
        ]
      };
      if(data.level == 9){
        return [
          {
            creature: "Ghoul",
            number: 6,
          },
          {
            creature: "Ghast",
            number: 3,
          },
          {
            creature: "Wights",
            number: 3,
          },
          {
            creature: "Mummy",
            number: 2,
          }
        ]
      };
      return [
        {
          creature: "Ghoul",
          number: multiplier,
        }
      ]
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
  }
  game.automatedevocations[game.system.id] = mergeObject(game.automatedevocations[game.system.id],game.settings.get(AECONSTS.MN, "customautospells"))
});