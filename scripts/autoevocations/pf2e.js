Hooks.once("ready", async function () {
    if (!game.automatedevocations) {
      game.automatedevocations = {};
      game.automatedevocations[game.system.id] = {};
    }
   if(game.system.id == "pf2e"){
    game.automatedevocations.pf2e = {
      "Forceful Hand":[
        {
          creature: "Forceful Hand",
          number: 1,
          animation: "magic1",
        },
      ],
      "Spiritual Weapon":[
        {
          creature: "Spiritual Weapon",
          number: 1,
          animation: "magic2",
        },
      ],
      "Summon Animal": (data) => {
        let multiplier = -1;
        if (data.level >= 2) multiplier = 1;
        if (data.level >= 3) multiplier = 2;
        if (data.level >= 4) multiplier = 3;
        if (data.level >= 5) multiplier = 5;
        if (data.level >= 6) multiplier = 7;
        if (data.level >= 7) multiplier = 9;
        if (data.level >= 8) multiplier = 11;
        if (data.level >= 9) multiplier = 13;
        if (data.level >= 10) multiplier = 15;
        let animals = game.actors
          .filter(
            (a) =>
              a.data.data.traits.traits.value.includes("animal") &&
              a.data.data.details.level.value <= multiplier
          )
          .sort((a, b) => {
            return a.data.data.details.level.value < b.data.data.details.level.value ? 1 : -1;
          });
        let creatures = [];
        for (let animal of animals) {
          creatures.push({
            creature: animal.name,
            number: 1,
          });
        }
        return creatures;
      },
      "Animate Dead": (data) => {
        let multiplier = -1;
        if (data.level >= 2) multiplier = 1;
        if (data.level >= 3) multiplier = 2;
        if (data.level >= 4) multiplier = 3;
        if (data.level >= 5) multiplier = 5;
        if (data.level >= 6) multiplier = 7;
        if (data.level >= 7) multiplier = 9;
        if (data.level >= 8) multiplier = 11;
        if (data.level >= 9) multiplier = 13;
        if (data.level >= 10) multiplier = 15;
        let undeads = game.actors
          .filter(
            (a) =>
              a.data.data.traits.traits.value.includes("undead") &&
              a.data.data.details.level.value <= multiplier
          )
          .sort((a, b) => {
            return a.data.data.details.level.value < b.data.data.details.level.value ? 1 : -1;
          });
        let creatures = [];
        for (let undead of undeads) {
          creatures.push({
            creature: undead.name,
            number: 1,
            animation: "darkness",
          });
        }
        return creatures;
      },
    };
    }
    game.automatedevocations[game.system.id] = mergeObject(game.automatedevocations[game.system.id],game.settings.get(AECONSTS.MN, "customautospells"))
  });