Hooks.once('init', async function() {
    game.settings.register(AECONSTS.MN, "companions", {
        name: "",
        hint: "",
        scope: "user",
        config: false,
        type: Object,
        default: {},
      });


      AECONSTS.animations = {
          "a": "a",
          "b": "b",
          "c": "c",
      }
});

Hooks.once('ready', async function() {
new CompanionManager().render(true)
});
