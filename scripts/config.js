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
      game.settings.register(AECONSTS.MN, "enableautomations", {
        name: game.i18n.localize(`AE.settings.enableautomations.title`),
        hint: game.i18n.localize(`AE.settings.enableautomations.hint`),
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
      })
      game.settings.register(AECONSTS.MN, "storeonactor", {
        name: game.i18n.localize(`AE.settings.storeonactor.title`),
        hint: game.i18n.localize(`AE.settings.storeonactor.hint`),
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
      })
});

Hooks.once('ready', async function() {
    let sortedAnims = Object.keys(AECONSTS.animationFunctions).sort();
    for(let k of sortedAnims){
      AECONSTS.animations[k] = game.i18n.localize(`AE.animations.${k}`)
    }
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
        onclick: function openCM(event){
            const appId = event.currentTarget.offsetParent.dataset.appid
            const actor = ui.windows[appId].object
            new CompanionManager(actor).render(true)
        }
    })
});