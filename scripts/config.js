Hooks.once('init', async function() {
    game.settings.register(AECONSTS.MN, "companions", {
        name: "",
        hint: "",
        scope: "user",
        config: false,
        type: Array,
        default: [],
      });


      AECONSTS.animations = {
          "fire": "Fire",
          "air": "Air",
          "lightning": "Lightning",
          "water": "Water",
      }
});

Hooks.once('ready', async function() {
new CompanionManager().render(true)
});
