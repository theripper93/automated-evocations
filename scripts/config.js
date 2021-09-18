Hooks.once("init", async function () {
  game.settings.register(AECONSTS.MN, "companions", {
    name: "",
    hint: "",
    scope: "client",
    config: false,
    type: Array,
    default: [],
  });
  game.settings.register(AECONSTS.MN, "customautospells", {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: Object,
    default: {},
  });
  game.settings.register(AECONSTS.MN, "customanimations", {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: Object,
    default: {},
  });
  game.settings.register(AECONSTS.MN, "autoclose", {
    name: game.i18n.localize(`AE.settings.autoclose.title`),
    hint: game.i18n.localize(`AE.settings.autoclose.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(AECONSTS.MN, "enableautomations", {
    name: game.i18n.localize(`AE.settings.enableautomations.title`),
    hint: game.i18n.localize(`AE.settings.enableautomations.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(AECONSTS.MN, "storeonactor", {
    name: game.i18n.localize(`AE.settings.storeonactor.title`),
    hint: game.i18n.localize(`AE.settings.storeonactor.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(AECONSTS.MN, "hidebutton", {
    name: game.i18n.localize(`AE.settings.hidebutton.title`),
    hint: game.i18n.localize(`AE.settings.hidebutton.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(AECONSTS.MN, "restrictOwned", {
    name: game.i18n.localize(`AE.settings.restrictOwned.title`),
    hint: game.i18n.localize(`AE.settings.restrictOwned.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
});

Hooks.once("ready", async function () {
  AECONSTS.animationFunctions = mergeObject(
    AECONSTS.animationFunctions,
    game.settings.get(AECONSTS.MN, "customanimations")
  );
  console.log("Automated Evocations: Animation Functions Loaded - ",AECONSTS.animationFunctions);
  let sortedAnims = Object.keys(AECONSTS.animationFunctions).sort();
  for (let k of sortedAnims) {
    const group = AECONSTS.animationFunctions[k].group || "z-none";
    AECONSTS.animations[group] = AECONSTS.animations[group] || [];
    AECONSTS.animations[group].push({
      name:
        AECONSTS.animationFunctions[k]?.name ||
        game.i18n.localize(`AE.animations.${k}`),
      key: k,
    });
  }
  AECONSTS.animations = Object.keys(AECONSTS.animations).sort().reduce(
    (obj, key) => { 
      obj[key] = AECONSTS.animations[key]; 
      return obj;
    }, 
    {}
  );
  //new CompanionManager().render(true)
});

Hooks.on("getActorSheetHeaderButtons", (app, buttons) => {
  if(game.settings.get(AECONSTS.MN, "hidebutton")) return;
  buttons.unshift({
    icon: "fas fa-users",
    class: "open-cm",
    label: game.i18n.localize("AE.actorSheetBtn"),
    onclick: function openCM(event) {
      const actor = app.object;
      new CompanionManager(actor).render(true);
    },
  });
});
