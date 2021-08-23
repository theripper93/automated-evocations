Hooks.on("createChatMessage",(chatMessage)=>{
    if(chatMessage.data.user !== game.user.id) return
    let spellName = chatMessage.data.flavor;
    let system = game.automatedevocations[game.system.id]
    if(!system)return
    if(system[spellName]){
        let summonData = []
        for(let creature of system[spellName]){
            let actor = game.actors.getName(creature.creature)
            if(actor){
                summonData.push({id:actor.id,number:creature.number,animation:creature.animation})
            }
        }
        new SimpleCompanionManager(summonData).render(true)
    }
})