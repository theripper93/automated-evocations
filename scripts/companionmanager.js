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
      width: window.innerWidth > 700 ? 700 : window.innerWidth - 100,
      height: window.innerHeight > 800 ? 800 : window.innerHeight - 100,
    };
  }

  getData() {
    return {};
  }

  async activateListeners(html) {
	this.loadCompanions();
	html.find("#companion-list").append(this.generateLi({actor: game.actors.getName("Druid")}));
    html.find(".add-companion").click(this._onAddCompanion.bind(this));
    html.find(".remove-companion").click(this._onRemoveCompanion.bind(this));

  }

  async _onAddCompanion(event) {}

  async _onRemoveCompanion(event) {}

  async loadCompanions() {}

  generateLi(data) {
    let $li = $(`
	<li id="companion" class="companion-item">
		<div class="summon-btn">
			<img class="actor-image" src="${data.actor.data.img}" alt="">
			<img class="warpgate-btn" src="modules/automated-evocations/images/fvtt-ouroboros.webp" alt="">
		</div>
    	<span class="actor-name">${data.actor.data.name}</span>
		<div class="companion-number"><input type="number" step="1" id="companion-number-val" value="${data.number || 1}"></div>
    	<select class="anim-dropdown">
        	${this.getAnimations()}
    	</select>
		<i class="fas fa-trash"></i>
	</li>
	`);
	return $li;
  }

  getAnimations() {
    if (this._animList) {
      return this._animList;
    } else {
      let animList = "";
      for (let [k, v] of Object.entries(AECONSTS.animations)) {
        animList += `<option value="${k}">${v}</option>`;
      }
      this._animList = animList;
      return this._animList;
    }
  }
}
