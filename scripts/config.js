Hooks.once('init', async function() {
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
});

Hooks.once('ready', async function() {
    let sortedAnims = Object.keys(AECONSTS.animationFunctions).sort();
    for(let k of sortedAnims){
      AECONSTS.animations[k] = game.i18n.localize(`AE.animations.${k}`)
    }
    mergeObject(game.automatedevocations[game.system.id],game.settings.get(AECONSTS.MN, "customautospells"))
//new CompanionManager().render(true)
});

Hooks.on("rendersheet",(app,html)=>{
    const button = `<a class="open-cm"><i class="fas fa-users"></i>${game.i18n.localize("AE.actorSheetBtn")}</a>`
    html.find(".window-title").after(button)
});
 

Hooks.on("getActorSheetHeaderButtons",(app,buttons)=>{
    buttons.unshift({
        icon: "fas fa-users",
        class: "open-cm",
        label: game.i18n.localize("AE.actorSheetBtn"),
        onclick: () => {
            new CompanionManager().render(true)
        }
    })
});