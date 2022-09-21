class CompanionManager extends FormApplication {
  constructor(actor) {
    super();
    this.actor = actor;
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      title: game.i18n.localize("AE.dialogs.companionManager.title"),
      id: "companionManager",
      template: `modules/automated-evocations/templates/companionmanager.hbs`,
      resizable: true,
      width: 300,
      height: window.innerHeight > 400 ? 400 : window.innerHeight - 100,
      dragDrop: [{ dragSelector: null, dropSelector: null }],
    };
  }

  static get api() {
    return {
      dnd5e: {
        getSummonInfo(args, spellLevel) {
          const spellDC = (args[0].assignedActor?.system.attributes.spelldc) || 0;
          return {
            level: (args[0].spellLevel || spellLevel) - spellLevel,
            maxHP: args[0].assignedActor?.system.attributes.hp.max || 1,
            modifier: args[0].assignedActor?.system.abilities[args[0].assignedActor?.system.attributes.spellcasting]?.mod,
            dc: spellDC,
            attack: {
              ms: spellDC - 8 + args[0].assignedActor?.system.bonuses.msak.attack,
              rs: spellDC - 8 + args[0].assignedActor?.system.bonuses.rsak.attack,
              mw: args[0].assignedActor?.system.bonuses.mwak.attack,
              rw: args[0].assignedActor?.system.bonuses.rwak.attack,
            }
          }
        }
      }
    }
  }

  getData() {
    return {};
  }

  async activateListeners(html) {
    html.find("#companion-list").before(`<div class="searchbox"><input type="text" class="searchinput" placeholder="Drag and Drop an actor to add it to the list."></div>`)
    this.loadCompanions();
    html.on("input", ".searchinput", this._onSearch.bind(this));
    html.on("click", "#remove-companion", this._onRemoveCompanion.bind(this));
    html.on("click", "#summon-companion", this._onSummonCompanion.bind(this));
    html.on("click", ".actor-name", this._onOpenSheet.bind(this));
    html.on("dragstart", "#companion", async (event) => {
      event.originalEvent.dataTransfer.setData(
        "text/plain",
        event.currentTarget.dataset.elid
      );
    });
    html.on("dragend", "#companion", async (event) => {
      event.originalEvent.dataTransfer.setData(
        "text/plain",
        event.currentTarget.dataset.elid
      );
    });
  }

  _onSearch(event) {
    const search = $(event.currentTarget).val();
    this.element.find(".actor-name").each(function() {
      if ($(this).text().toLowerCase().includes(search.toLowerCase())) {
        $(this).parent().slideDown(200);
      } else {
        $(this).parent().slideUp(200);
      }
    });
  }

  async _onDrop(event) {
    let data;
    try {
      data = JSON.parse(event.dataTransfer.getData("text/plain"));
    } catch {
      data = event.dataTransfer.getData("text/plain");
    }
    const li = this.element.find(`[data-elid="${data}"]`);
    if (li.length && !$(event.target).hasClass("nodrop")) {
      let target = $(event.target).closest("li");
      if (target.length && target[0].dataset.elid != data) {
        $(li).remove();
        target.before($(li));
      }
    }
    if (!data.type === "Actor") return;
    const actor = await fromUuid(data.uuid)
    this.element
      .find("#companion-list")
      .append(this.generateLi({ id: actor.id }));
    this.saveData();
  }

  async _onSummonCompanion(event) {
    this.minimize();
    const animation = $(event.currentTarget.parentElement.parentElement)
      .find(".anim-dropdown")
      .val();
    const aId = event.currentTarget.dataset.aid;
    const actor = game.actors.get(aId);
    const duplicates = $(event.currentTarget.parentElement.parentElement)
      .find("#companion-number-val")
      .val();
    const tokenData = await actor.getTokenData({elevation: _token?.data?.elevation ?? 0});
    const posData = game?.Levels3DPreview?._active ? await this.pickCanvasPosition3D() : await warpgate.crosshairs.show({
      size: Math.max(tokenData.width,tokenData.height)*(tokenData.texture.scaleX + tokenData.texture.scaleY)/2,
      icon: "modules/automated-evocations/assets/black-hole-bolas.webp",
      label: "",
    });
    if (!posData || posData.cancelled) {
      this.maximize();  
      return;
    }
    if(typeof AECONSTS.animationFunctions[animation].fn == "string"){
      game.macros.getName(AECONSTS.animationFunctions[animation].fn).execute(posData,tokenData);
    }else{
      AECONSTS.animationFunctions[animation].fn(posData, tokenData);
    }
    
    await this.wait(AECONSTS.animationFunctions[animation].time);
    //get custom data macro
    const customTokenData = await game.macros.getName(`AE_Companion_Macro(${actor.name})`)?.execute({summon: actor,spellLevel: this.spellLevel || 0, duplicates: duplicates, assignedActor: this.caster || game.user.character || _token.actor}) || {};
    customTokenData.elevation = posData.z ?? _token?.document?.elevation ?? 0 ;
    tokenData.elevation = customTokenData.elevation;
    Hooks.on("preCreateToken", (tokenDoc, td) => {
      tokenDoc.updateSource({elevation: customTokenData.elevation});
    });
    warpgate.spawnAt(
      { x: posData.x, y: posData.y},
      tokenData,
      customTokenData || {},
      {},
      { duplicates }
    );
    console.log("Automated Evocations Summoning:", {
      assignedActor: this.caster || game?.user?.character || _token?.actor,
      spellLevel: this.spellLevel || 0,
      duplicates: duplicates,
      warpgateData: customTokenData || {},
      summon: actor,
      tokenData: tokenData,
      posData: posData,
    })
    if(game.settings.get(AECONSTS.MN, "autoclose")) this.close();
    else this.maximize();  
  }

  async _onRemoveCompanion(event) {
    Dialog.confirm({
      title: game.i18n.localize("AE.dialogs.companionManager.confirm.title"),
      content: game.i18n.localize(
        "AE.dialogs.companionManager.confirm.content"
      ),
      yes: () => {
        event.currentTarget.parentElement.remove();
        this.saveData();
      },
      no: () => {},
      defaultYes: false,
    });
  }

  async _onOpenSheet(event) {
    const actorId = event.currentTarget.parentElement.dataset.aid;
    const actor = game.actors.get(actorId);
    if (actor) {
      actor.sheet.render(true);
    }
  }

  async loadCompanions() {
    let data = this.actor && (this.actor.getFlag(AECONSTS.MN,"isLocal") || game.settings.get(AECONSTS.MN, "storeonactor")) ? this.actor.getFlag(AECONSTS.MN,"companions") || [] : game.user.getFlag(AECONSTS.MN, "companions");
    if (data) {
      for (let companion of data) {
        this.element.find("#companion-list").append(this.generateLi(companion));
      }
    }
  }

  generateLi(data) {
    const actor = game.actors.get(data.id) || game.actors.getName(data.id);
    if (!actor) return "";
    const restricted = game.settings.get(AECONSTS.MN, "restrictOwned")
    if(restricted && !actor.isOwner) return "";
    let $li = $(`
	<li id="companion" class="companion-item" data-aid="${
    actor.id
  }" data-elid="${randomID()}" draggable="true">
		<div class="summon-btn">
			<img class="actor-image" src="${actor.img}" alt="">
			<div class="warpgate-btn" id="summon-companion" data-aid="${actor.id}"></div>
		</div>
    	<span class="actor-name">${actor.name}</span>
		<div class="companion-number"><input type="number" min="1" max="99" class="fancy-input" step="1" id="companion-number-val" value="${
      data.number || 1
    }"></div>
    	<select class="anim-dropdown">
        	${this.getAnimations(data.animation)}
    	</select>
		<i id="remove-companion" class="fas fa-trash"></i>
	</li>
	`);
    //    <i id="advanced-params" class="fas fa-edit"></i>
    return $li;
  }

  getAnimations(anim) {

    let animList = "";
    for (let [group, animations] of Object.entries(AECONSTS.animations)) {
      const localGroup = game.i18n.localize(`AE.groups.${group}`)
      animList+=`<optgroup label="${localGroup == `AE.groups.${group}` ? group : localGroup}">`;
      for (let a of animations) {
      animList += `<option value="${a.key}" ${
        a.key == anim ? "selected" : ""
      }>${a.name}</option>`;
    }
    animList += "</optgroup>";
    }
    return animList;
  }
  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async saveData() {
    let data = [];
    for (let companion of this.element.find(".companion-item")) {
      data.push({
        id: companion.dataset.aid,
        animation: $(companion).find(".anim-dropdown").val(),
        number: $(companion).find("#companion-number-val").val(),
      });
    }
    this.actor && (this.actor.getFlag(AECONSTS.MN,"isLocal") || game.settings.get(AECONSTS.MN, "storeonactor")) ? this.actor.setFlag(AECONSTS.MN,"companions", data) : game.user.setFlag(AECONSTS.MN, "companions", data);
  }

  close(noSave = false) {
    if (!noSave) this.saveData();
    super.close();
  }

  async pickCanvasPosition3D() {
    ui.notifications.notify(game.i18n.localize("AE.pick3d"));
    const canvas = game.Levels3DPreview.renderer.domElement;

    return new Promise((resolve, reject) => {
      function onPick(event) {
        canvas.removeEventListener("click", onPick);
        if(event.which != 1) return reject();
        resolve(game.Levels3DPreview.interactionManager.canvas2dMousePosition);
      }
      canvas.addEventListener("click", onPick);
    })
  }
}

class SimpleCompanionManager extends CompanionManager {
  constructor(summonData,spellLevel,actor) {
    super();
    this.caster = actor;
    this.summons = summonData;
    this.spellLevel = spellLevel
  }

  async activateListeners(html) {
    for (let summon of this.summons) {
      this.element.find("#companion-list").append(this.generateLi(summon));
    }

    html.on("click", "#summon-companion", this._onSummonCompanion.bind(this));
    html.on("click", ".actor-name", this._onOpenSheet.bind(this));
  }

  _onDrop(event) {}

  close() {
    super.close(true);
  }
}