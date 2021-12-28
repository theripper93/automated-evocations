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
        if (data.spellLevel >= 2) multiplier = 1;
        if (data.spellLevel >= 3) multiplier = 2;
        if (data.spellLevel >= 4) multiplier = 3;
        if (data.spellLevel >= 5) multiplier = 5;
        if (data.spellLevel >= 6) multiplier = 7;
        if (data.spellLevel >= 7) multiplier = 9;
        if (data.spellLevel >= 8) multiplier = 11;
        if (data.spellLevel >= 9) multiplier = 13;
        if (data.spellLevel >= 10) multiplier = 15;
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
        if (data.spellLevel >= 2) multiplier = 1;
        if (data.spellLevel >= 3) multiplier = 2;
        if (data.spellLevel >= 4) multiplier = 3;
        if (data.spellLevel >= 5) multiplier = 5;
        if (data.spellLevel >= 6) multiplier = 7;
        if (data.spellLevel >= 7) multiplier = 9;
        if (data.spellLevel >= 8) multiplier = 11;
        if (data.spellLevel >= 9) multiplier = 13;
        if (data.spellLevel >= 10) multiplier = 15;
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
	  "Summon Lesser Servitor": (data) => {
    let servitormultiplier = -1;
    if (data.spellLevel == 2) servitormultiplier = 1;
    if (data.spellLevel == 3) servitormultiplier = 2;
    if (data.spellLevel == 4) servitormultiplier = 3;
    let servitors = game.actors
      .filter(
        (a) =>
          (a.data.data.traits.traits.value.includes("fiend") ||
          a.data.data.traits.traits.value.includes("monitor") ||
          a.data.data.traits.traits.value.includes("celestial")) &&
          a.data.data.details.level.value <= servitormultiplier &&
          a.data.type == "npc"
      )
      .sort((a, b) => {
        return a.data.data.details.level.value < b.data.data.details.level.value ? 1 : -1;
      });
    let creatures = [];
    for (let servitor of servitors) {
      creatures.push({
        creature: servitor.name,
        number: 1,
        animation: "magic2",
      });
    }
    const extraCreatures = ["Raven", "Eagle", "Guard Dog", "Black Bear", "Giant Bat", "Leopard", "Great White Shark", "Tiger"]
let arrayendpoint = 3;
if(data.spellLevel == 2) arrayendpoint = 3;
if(data.spellLevel == 3) arrayendpoint = 6;
if(data.spellLevel >= 4) arrayendpoint = 8;

    for(let i=0; i < arrayendpoint;i++) {
        creatures.push({
            creature: extraCreatures[i],
            number: 1,
            animation: "magic2",
        });
    }
    return creatures;
     },
    };
    }
    game.automatedevocations[game.system.id] = mergeObject(game.automatedevocations[game.system.id],game.settings.get(AECONSTS.MN, "customautospells"))
  });