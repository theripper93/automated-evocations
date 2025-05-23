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
                    const spellDC = args[0].assignedActor?.system.attributes.spelldc || 0;
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
                        },
                    };
                },
            },
        };
    }

    getData() {
        return {};
    }

    async activateListeners(html) {
        html.find("#companion-list").before(`<div class="searchbox"><input type="text" class="searchinput" placeholder="Drag and Drop an actor to add it to the list."></div>`);
        this.loadCompanions();
        html.on("input", ".searchinput", this._onSearch.bind(this));
        html.on("click", "#remove-companion", this._onRemoveCompanion.bind(this));
        html.on("click", "#summon-companion", this._onSummonCompanion.bind(this));
        html.on("click", ".actor-name", this._onOpenSheet.bind(this));
        html.on("dragstart", "#companion", async (event) => {
            event.originalEvent.dataTransfer.setData("text/plain", event.currentTarget.dataset.elid);
        });
        html.on("dragend", "#companion", async (event) => {
            event.originalEvent.dataTransfer.setData("text/plain", event.currentTarget.dataset.elid);
        });
    }

    _onSearch(event) {
        const search = $(event.currentTarget).val();
        this.element.find(".actor-name").each(function () {
            if ($(this).text().toLowerCase().includes(search.toLowerCase())) {
                $(this).parent().slideDown(200);
            } else {
                $(this).parent().slideUp(200);
            }
        });
    }

    _canDragDrop() {
        return true;
    }

    _canDragStart() {
        return true;
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
        //const actor = await fromUuid(data.uuid)
        this.element.find("#companion-list").append(await this.generateLi({ id: data.uuid }));
        this.saveData();
    }

    async _onSummonCompanion(event) {
        this.minimize();
        const animation = $(event.currentTarget.parentElement.parentElement).find(".anim-dropdown").val();
        const aId = event.currentTarget.dataset.aid;
        const actor = game.actors.get(aId) || (await fromUuid(aId));
        const duplicates = $(event.currentTarget.parentElement.parentElement).find("#companion-number-val").val();
        const tokenData = await actor.getTokenDocument({ elevation: _token?.data?.elevation ?? 0 });

        //get custom data macro
        const customTokenData = (await this.evaluateExpression(game.macros.getName(`AE_Companion_Macro(${actor.name})`)?.command, { summon: actor, spellLevel: this.spellLevel || 0, duplicates: duplicates, assignedActor: this.caster || game.user.character || _token.actor })) || {};

        let isCompendiumActor = false;
        if (!tokenData.actor) {
            isCompendiumActor = true;
            tokenData.updateSource({ actorId: Array.from(game.actors).find((a) => !a.prototypeToken?.actorLink).id });
        }

        if (this.range) this.drawRange(this.range);
        const portal = new Portal();
        portal.addCreature(actor, { count: duplicates, updateData: customTokenData });
        portal.texture("modules/automated-evocations/assets/black-hole-bolas.webp");
        const posData = await portal.pick();
        this.clearRange();
        if (!posData) {
            this.maximize();
            return;
        }
        if (typeof AECONSTS.animationFunctions[animation].fn == "string") {
            this.evaluateExpression(game.macros.getName(AECONSTS.animationFunctions[animation].fn).command, posData, tokenData);
        } else {
            AECONSTS.animationFunctions[animation].fn(posData, tokenData);
        }

        await this.wait(AECONSTS.animationFunctions[animation].time);

        Hooks.callAll("automated-evocations.preCreateToken", { tokenData: tokenData, customTokenData: customTokenData, posData: posData, actor: actor, spellLevel: this.spellLevel || 0, duplicates: duplicates, assignedActor: this.caster || game.user.character || _token.actor });

        const tokens = await portal.spawn();

        if (tokens.length && isCompendiumActor) {
            for (const t of tokens) {
                const tokenDocument = canvas.tokens.get(t).document;
                await tokenDocument.update({ delta: actor.toObject() });
            }
        }
        const postSummon = {
            assignedActor: this.caster || game?.user?.character || _token?.actor,
            spellLevel: this.spellLevel || 0,
            duplicates: duplicates,
            warpgateData: customTokenData || {},
            portalData: customTokenData || {},
            summon: actor,
            tokenData: tokenData,
            posData: posData,
            summonedTokens: tokens,
        };
        console.log("Automated Evocations Summoning:", postSummon);
        Hooks.callAll("automated-evocations.postSummon", postSummon);
        if (game.settings.get(AECONSTS.MN, "autoclose")) this.close();
        else this.maximize();
    }

    async drawRange() {
        const token = _token;
        if (!token) return;
        this.rangeData = {
            token,
        };
        const rangeGraphics = new PIXI.Graphics();
        rangeGraphics
            .lineStyle(1, 0x000000, 1)
            .beginFill(0x000000, 0.1)
            .drawCircle(0, 0, this.range * (canvas.scene.dimensions.size / canvas.scene.dimensions.distance))
            .endFill();
        if (this.image) {
            const texture = this.image ? await loadTexture(this.image) : null;
            //create a matrix so that the texture is centered and fills the circle
            const matrix = new PIXI.Matrix();
            matrix.translate(-texture.width / 2, -texture.height / 2);
            matrix.scale((2 * this.range * (canvas.scene.dimensions.size / canvas.scene.dimensions.distance)) / texture.width, (2 * this.range * (canvas.scene.dimensions.size / canvas.scene.dimensions.distance)) / texture.height);
            rangeGraphics
                .beginTextureFill({ texture: texture, matrix, alpha: 0.3 })
                .drawCircle(0, 0, this.range * (canvas.scene.dimensions.size / canvas.scene.dimensions.distance))
                .endFill();
        }

        rangeGraphics.position.set((canvas.scene.dimensions.size * token.document.width) / 2, (canvas.scene.dimensions.size * token.document.height) / 2);
        rangeGraphics.zIndex = -100;

        //add as first child so that it is behind the token
        token.addChildAt(rangeGraphics, 0);

        this.rangeData.graphics = rangeGraphics;
    }

    async clearRange() {
        if (!this.rangeData) return;
        this.rangeData.token.removeChild(this.rangeData.graphics);
        this.rangeData.graphics.destroy();
        delete this.rangeData;
    }

    async evaluateExpression(expression, ...args) {
        if (!expression) return null;
        const AsyncFunction = async function () {}.constructor;
        const fn = new AsyncFunction("args", $("<span />", { html: expression }).text());
        try {
            return await fn(args);
        } catch (e) {
            ui.notifications.error("There was an error in your macro syntax. See the console (F12) for details");
            console.error(e);
            return undefined;
        }
    }

    async _onRemoveCompanion(event) {
        Dialog.confirm({
            title: game.i18n.localize("AE.dialogs.companionManager.confirm.title"),
            content: game.i18n.localize("AE.dialogs.companionManager.confirm.content"),
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
        const actor = game.actors.get(actorId) || (await fromUuid(actorId));
        if (actor) {
            actor.sheet.render(true);
        }
    }

    async loadCompanions() {
        let data = this.actor && (this.actor.getFlag(AECONSTS.MN, "isLocal") || game.settings.get(AECONSTS.MN, "storeonactor")) ? this.actor.getFlag(AECONSTS.MN, "companions") || [] : game.user.getFlag(AECONSTS.MN, "companions");
        if (data) {
            for (let companion of data) {
                this.element.find("#companion-list").append(await this.generateLi(companion));
            }
        }
    }

    async generateLi(data) {
        const actor = game.actors.get(data.id) || game.actors.getName(data.id) || (await fromUuid(data.id));
        if (!actor) return "";
        const uuid = actor.uuid;
        const restricted = game.settings.get(AECONSTS.MN, "restrictOwned");
        if (restricted && !actor.isOwner) return "";
        let $li = $(`
	<li id="companion" class="companion-item" data-aid="${uuid}" data-elid="${foundry.utils.randomID()}" draggable="true">
		<div class="summon-btn">
			<img class="actor-image" src="${actor.img}" alt="">
			<div class="warpgate-btn" id="summon-companion" data-aid="${uuid}"></div>
		</div>
    	<span class="actor-name">${actor.name}</span>
		<div class="companion-number"><input type="number" min="1" max="99" class="fancy-input" step="1" id="companion-number-val" value="${data.number || 1}"></div>
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
            const localGroup = game.i18n.localize(`AE.groups.${group}`);
            animList += `<optgroup label="${localGroup == `AE.groups.${group}` ? group : localGroup}">`;
            for (let a of animations) {
                animList += `<option value="${a.key}" ${a.key == anim ? "selected" : ""}>${a.name}</option>`;
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
        this.actor && (this.actor.getFlag(AECONSTS.MN, "isLocal") || game.settings.get(AECONSTS.MN, "storeonactor")) ? this.actor.setFlag(AECONSTS.MN, "companions", data) : game.user.setFlag(AECONSTS.MN, "companions", data);
        Hooks.callAll("automated-evocations.saveCompanionData", { actor: this.actor, data: data });
    }

    close(noSave = false) {
        if (!noSave) this.saveData();
        super.close();
    }
}

class SimpleCompanionManager extends CompanionManager {
    constructor(summonData, spellLevel, actor, range, image) {
        super();
        this.caster = actor;
        this.summons = summonData;
        this.spellLevel = spellLevel;
        this.range = range;
        this.image = image;
    }

    async activateListeners(html) {
        for (let summon of this.summons) {
            this.element.find("#companion-list").append(await this.generateLi(summon));
        }

        html.on("click", "#summon-companion", this._onSummonCompanion.bind(this));
        html.on("click", ".actor-name", this._onOpenSheet.bind(this));
    }

    _onDrop(event) {}

    close() {
        super.close(true);
    }
}
