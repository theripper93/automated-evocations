Hooks.on("createChatMessage", async (chatMessage) => {
  try{
    if(game.system.id != "dnd5e")return;
    if (chatMessage.data.user !== game.user.id || !game.settings.get(AECONSTS.MN, "enableautomations")) return;
  
    const messageContent = $(chatMessage.data.content);
    if(!messageContent.length)return;
    const actorId = messageContent[0].dataset.actorId;
    const itemId = messageContent[0].dataset.itemId;
    const spellLevel = parseInt(messageContent[0].dataset.spellLevel);
    const tokenId = messageContent[0].dataset.tokenId;
    const token = tokenId ? await fromUuid(tokenId) : null;
    const actor = token?.actor ?? game.actors.get(actorId);
    if(!actor) return;
    const spellName = actor?.items?.get(itemId)?.name;
  
    let system = game.automatedevocations[game.system.id];
    if (!system) return;
    if (system[spellName]) {
      //attempt to get spell level
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
  }catch(e){}
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
    const data = {level:item, spellLevel:spellLevel}
	//const data = {level:item}
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