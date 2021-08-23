class CompanionManager extends FormApplication {
  constructor() {
    super();
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      title: game.i18n.localize("AE.dialogs.companionManager.title"),
      id: "companionManager",
      template: `modules/automated-evocations/templates/companionmanager.hbs`,
      resizable: true,
      width: window.innerWidth > 400 ? 400 : window.innerWidth - 100,
      height: window.innerHeight > 400 ? 400 : window.innerHeight - 100,
      dragDrop: [{ dragSelector: null, dropSelector: null }],
    };
  }

  getData() {
    return {};
  }

  async activateListeners(html) {
    this.loadCompanions();
    html.on("click", "#remove-companion", this._onRemoveCompanion.bind(this));
    html.on("click", "#summon-companion", this._onSummonCompanion.bind(this));
  }

  _onDrop(event) {
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (!data.type === "Actor") return;
    this.element.find("#companion-list").append(this.generateLi({ id: data.id }));
    this.saveData();
  }

  async _onSummonCompanion(event) {
    const animation = $(event.currentTarget.parentElement.parentElement).find(".anim-dropdown").val();
    const aId = event.currentTarget.dataset.aid;
    const duplicates = $(event.currentTarget.parentElement.parentElement).find("#companion-number-val").val();
    const tokenData = await game.actors.get(aId).getTokenData();
    const posData = await warpgate.crosshairs.show(1, 'icons/svg/dice-target.svg', '')
    AECONSTS.animationFunctions[animation].fn(posData,tokenData);
    await this.wait(AECONSTS.animationFunctions[animation].time)
    warpgate.spawnAt({x: posData.x, y: posData.y}, tokenData, {}, {}, {duplicates})
  }

  async _onRemoveCompanion(event) {
    Dialog.confirm({
      title: game.i18n.localize("AE.dialogs.companionManager.confirm.title"),
      content: game.i18n.localize("AE.dialogs.companionManager.confirm.content"),
      yes: () => {
        event.currentTarget.parentElement.remove()
        this.saveData();
      },
      no: () => {},
      defaultYes: false,
    });
  }

  async loadCompanions() {
    let data = game.settings.get(AECONSTS.MN, "companions");
    if (data) {
      for (let companion of data) {
        this.element.find("#companion-list").append(this.generateLi(companion));
      }
    }
  }

  generateLi(data) {
    const actor = game.actors.get(data.id)
    if(!actor) return ""
    let $li = $(`
	<li id="companion" class="companion-item" data-aid="${actor.id}">
		<div class="summon-btn">
			<img class="actor-image" src="${actor.data.img}" alt="">
			<div class="warpgate-btn" id="summon-companion" data-aid="${actor.id}"></div>
		</div>
    	<span class="actor-name">${actor.data.name}</span>
		<div class="companion-number"><input type="number" step="1" id="companion-number-val" value="${
      data.number || 1
    }"></div>
    	<select class="anim-dropdown">
        	${this.getAnimations(data.animation)}
    	</select>
		<i id="remove-companion" class="fas fa-trash"></i>
    <i id="advanced-params" class="fas fa-edit"></i>
	</li>
	`);
    return $li;
  }

  getAnimations(anim) {
      let animList = "";
      for (let [k, v] of Object.entries(AECONSTS.animations)) {
        animList += `<option value="${k}" ${k==anim ? "selected":""}>${v}</option>`;
      }
      return animList
  }
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveData(){
    let data = []
    for(let companion of this.element.find(".companion-item")){
      data.push({
        id: companion.dataset.aid,
        animation: $(companion).find(".anim-dropdown").val(),
        number: $(companion).find("#companion-number-val").val()
      })
    }
    game.settings.set(AECONSTS.MN, "companions", data);
  }

  close(){
    this.saveData();
    super.close()
  }
}
