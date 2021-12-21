Hooks.on("createChatMessage", async (chatMessage) => {
  if(game.system.id != "dnd5e")return;
  if (chatMessage.data.user !== game.user.id || !game.settings.get(AECONSTS.MN, "enableautomations")) return;
  let spellName =
    chatMessage.data.flavor ||
    canvas.tokens.get(chatMessage?.data?.speaker?.token)?.actor?.items?.get(chatMessage?.data?.flags?.dnd5e?.roll?.itemId)?.data?.name;
  let system = game.automatedevocations[game.system.id];
  if (!system) return;
  if (system[spellName]) {
    //attempt to get spell level
    let spellLevel;
    const midiLevel = typeof MidiQOL !== "undefined" && chatMessage.data.flags["midi-qol"] ? MidiQOL.Workflow.getWorkflow(chatMessage.data.flags["midi-qol"].workflowId)?.itemLevel : undefined;
    const brLevel = chatMessage.data.flags?.betterrolls5e?.params?.slotLevel
    const coreLevel = $(chatMessage.data.content)?.data("spell-level")
    spellLevel = midiLevel || brLevel || coreLevel || 0;
    spellLevel = parseInt(spellLevel);
    let summonData = [];
    const data = {level:spellLevel}
    const creatures = typeof system[spellName] === "function" ? system[spellName](data) : system[spellName];
    for (let creature of creatures) {
      if (creature.level && spellLevel && creature.level >= spellLevel)
        continue;
      let actor = game.actors.getName(creature.creature);
      if (actor) {
        summonData.push({
          id: actor.id,
          number: creature.number,
          animation: creature.animation,
        });
      }
    }
    new SimpleCompanionManager(summonData,spellLevel,canvas.tokens.get(chatMessage?.data?.speaker?.token)?.actor).render(true);
  }
});

Hooks.on("createChatMessage", async (chatMessage) => {
  if(game.system.id != "pf2e")return;
  if (chatMessage.data.user !== game.user.id || !game.settings.get(AECONSTS.MN, "enableautomations")) return;
  const item = await fromUuid(chatMessage.data.flags.pf2e.origin.uuid)
  const spellName = item.data.name;
  let system = game.automatedevocations[game.system.id];
  if (!system) return;
  if (system[spellName]) {
    let summonData = [];
    const spellLevel = $(chatMessage.data.content)?.data("spell-lvl")
    const data = {level:item}
    const creatures = typeof system[spellName] === "function" ? system[spellName](data) : system[spellName];
    for (let creature of creatures) {
      if (creature.level && spellLevel && creature.level >= spellLevel)
        continue;
      let actor = game.actors.getName(creature.creature);
      if (actor) {
        summonData.push({
          id: actor.id,
          number: creature.number,
          animation: creature.animation,
        });
      }
    }
    new SimpleCompanionManager(summonData,spellLevel,canvas.tokens.get(chatMessage?.data?.speaker?.token)?.actor).render(true);
  }
});