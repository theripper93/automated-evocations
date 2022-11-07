class AutomatedEvocationsCustomBindings extends FormApplication {
    constructor() {
      super();
    }
  
    static get defaultOptions() {
      return {
        ...super.defaultOptions,
        title: game.i18n.localize("AE.custombindings.bindingstitle"),
        id: "companionManager-custombindings",
        template: `modules/automated-evocations/templates/custombindings.hbs`,
        resizable: true,
        width: 300,
        height: window.innerHeight > 400 ? 400 : window.innerHeight - 100,
        dragDrop: [{ dragSelector: null, dropSelector: null }],
      };
    }

    getData() {
        return {
            customautospells: game.settings.get(AECONSTS.MN, "customautospells")
        }
    }

    activateListeners(html) {
        html.on("click", ".fa-trash", async (event) => {
            const binding = event.currentTarget.closest("li").dataset.binding;
            const customautospells = game.settings.get(AECONSTS.MN, "customautospells");
            delete customautospells[binding];
            await game.settings.set(AECONSTS.MN, "customautospells", customautospells);
            this.render(true);
        });
        html.on("click", ".fa-edit", async (event) => {
            const binding = event.currentTarget.closest("li").dataset.binding;
            new AutomatedEvocationsCustomBindingsConfig(binding).render(true);
            
        });
        html.on("click", ".add-binding", async (event) => {
            const binding = "New Binding";
            const customautospells = game.settings.get(AECONSTS.MN, "customautospells");
            customautospells[binding] = [];
            await game.settings.set(AECONSTS.MN, "customautospells", customautospells);
            this.render(true);
        });
        html.on("change submit", "input", async (event) => {
            const binding = event.currentTarget.closest("li").dataset.binding;
            const customautospells = game.settings.get(AECONSTS.MN, "customautospells");
            customautospells[event.currentTarget.value] = customautospells[binding];
            delete customautospells[binding];
            await game.settings.set(AECONSTS.MN, "customautospells", customautospells);
            this.render(true);
        });
    }
}

class AutomatedEvocationsCustomBindingsConfig extends FormApplication {
  constructor(binding) {
    super();
    this._binding = binding;
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      title: game.i18n.localize("AE.custombindings.bindingtitle"),
      id: "companionManager-custombinding-config",
      template: `modules/automated-evocations/templates/custombindingconfig.hbs`,
      resizable: true,
      width: 300,
      height: window.innerHeight > 400 ? 400 : window.innerHeight - 100,
      dragDrop: [{ dragSelector: null, dropSelector: null }],
    };
  }

  getData() {
      const animations = {};
      for(let [key, value] of Object.entries(AECONSTS.animations)) {
        animations[key] = {};
        for(let a of value) {
          const aKey = a.key;
          animations[key][aKey] = a.name;
        }
      }

      return {
          binding: game.settings.get(AECONSTS.MN, "customautospells")[this._binding],
          animations
      }
  }

  activateListeners(html) {
    html.on("click", ".fa-trash", async (event) => {
        const binding = game.settings.get(AECONSTS.MN, "customautospells")[this._binding];
        const index = event.currentTarget.closest("li").dataset.index;
        binding.splice(index, 1);
        const newBindings = game.settings.get(AECONSTS.MN, "customautospells");
        newBindings[this._binding] = binding;
        await game.settings.set(AECONSTS.MN, "customautospells",newBindings);
        this.render(true);
    });
    html.on("click", ".add-binding", async (event) => {
        const binding = game.settings.get(AECONSTS.MN, "customautospells")[this._binding];
        binding.push({creature: "Creature Name" ,number: 1});
        const newBindings = game.settings.get(AECONSTS.MN, "customautospells");
        newBindings[this._binding] = binding;
        await game.settings.set(AECONSTS.MN, "customautospells", newBindings);
        this.render(true);
    });
    html.on("change submit", "input", async (event) => {
      this.saveData(true);
    });
  }

  async saveData(render = true) {
    const newBinding = [];
    for(let li of this.element.find("li")) {
      if(li.className === "add-binding") continue;
      const creature = li.querySelector("input[type=text]").value;
      const animation = li.querySelector("select").value;
      const number = parseInt(li.querySelector("input[type=number]").value);
      newBinding.push({creature, number, animation});
    }
    const newBindings = game.settings.get(AECONSTS.MN, "customautospells");
    newBindings[this._binding] = newBinding;
    await game.settings.set(AECONSTS.MN, "customautospells", newBindings);
    if(render) this.render(true);
  }

  async close() {
    await this.saveData(false);
    await super.close();
    Object.values(ui.windows).forEach((window) => {
      if (window instanceof AutomatedEvocationsCustomBindings) {
        window.render(true);
      }
    });
  }
}