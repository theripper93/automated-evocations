Hooks.on("createChatMessage", (chatMessage) => {
  if (chatMessage.data.user !== game.user.id || !game.settings.get(AECONSTS.MN, "enableautomations")) return;
  let spellName =
    chatMessage.data.flavor ||
    chatMessage.data.flags.betterrolls5e?.entries[0]?.title;
  let system = game.automatedevocations[game.system.id];
  if (!system) return;
  if (system[spellName]) {
    //attempt to get spell level
    let spellLevel;
    const midiLevel = typeof MidiQOL !== "undefined" && chatMessage.data.flags["midi-qol"] ? MidiQOL.Workflow.getWorkflow(chatMessage.data.flags["midi-qol"].workflowId)?.itemLevel : undefined;
    const brLevel = chatMessage.data.flags?.betterrolls5e?.params?.slotLevel
    const coreLevel = $(chatMessage.data.content)?.data("spell-level")
    spellLevel = midiLevel || brLevel || coreLevel || 0;
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
    new SimpleCompanionManager(summonData,spellLevel).render(true);
  }
});