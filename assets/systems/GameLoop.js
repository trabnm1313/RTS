

export default function (entities, { events, dispatch }){
    const Knight = entities.Knight
    
<<<<<<< Updated upstream
    //If events > 0 (one or more event occurs)
    if(events.length){
        events.forEach((event) => {
            if(event.name == "HERO_CLICKED"){
                Knight.status.Health -= 1
                console.log(Knight.status)
=======
    if(loadStatus){

        //Generate intitial entity
        if(initialGenerate && words.length > 1){
            entitiesList = []
            initialGenerate = false
            timer = setInterval(() => {
                time += 1
                console.log(time)
            }, 1000)
            generateWord()
            return entitiesGenerator(engine, words, Constants.Level)
        }else if(initialGenerate){
            return {}
        }

        //If there is more than 0 events occurs (object being touch and dispatch events, etc)
        if(events.length > 0 && events[0].status != undefined){            

            //Selecting Phase
            if(phase == "monster"){

                //Selecting condition
                if(events["0"].status.type == "Monster" && monsterSelected == "" && events["0"].status.rested != true && events["0"].status.isAlive){ //Select monster first
                    monsterSelected = events[0]
                    monsterSelected.status.selected = true
                }else if(events["0"].id == monsterSelected.id){ //Select same monster, remove the selected on both side
                    monsterSelected.status.selected = false
                    monsterSelected = ""
                    humanSelected = ""
                }else if(events["0"].status.type == "Monster" && monsterSelected != "" && events["0"].status.rested != true && events["0"].status.isAlive){ //Selecte different monster while there is selected
                    monsterSelected.status.selected = false
                    if(humanSelected != ""){
                        humanSelected.status.selected = false
                        humanSelected = ""
                    }
                    monsterSelected = events[0]
                    monsterSelected.status.selected = true
                }else if(events["0"].status.type == "Human" && monsterSelected != "" && events["0"].status.isAlive == true){ //Select human after monster and human not dead yet
                    humanSelected = events[0]
                    humanSelected.status.Health -= 200

                    //Change if the attacked human is dead yet
                    if(humanSelected.status.Health <= 0) humanSelected.status.isAlive = false

                    //DEBUG
                    console.log(monsterSelected.status.id + " Attack " + humanSelected.status.id)
                    console.log(monsterSelected.status.Attack)
                    console.log(humanSelected.id + " have " + humanSelected.status.Health + " HP left and isAlive:" + humanSelected.status.isAlive)
                    

                    //Remove target monster out of attackQueue
                    attackQueue.splice(attackQueue.indexOf(monsterSelected), 1)

                    //Clear state after attack
                    monsterSelected.status.rested = true
                    monsterSelected.status.selected = false
                    monsterSelected = ""
                    humanSelected = ""

                    //if all human died, victory
                    let humanLeft = entitiesList.filter(entity => { return entity.status.type == "Human" && entity.status.isAlive == true})
                    if(humanLeft.length == 0){

                        //mock gameLooping itself, no other stage yet
                        //-----------------------------------------
                        // changePhases("alphabet")
                        // return entitiesGenerator(engine, words)
                        //-----------------------------------------
                        
                        //Constants.stage = <whatever> here
                        changePhases("alphabet")
                        entitiesList = []
                        Constants.Level += 1
                        Constants.stage = "Shop"
                        initialGenerate = true
                        time = 0
                        clearInterval(timer)
                        return {}

                    }
                    
                    //Change phases when the last monster attacked
                    if(attackQueue.length == 0){
                        changePhases("human")
                    }


                    console.log("Phase: " + phase + ", Random attack from humanity has been initialized!") //DEBUG
                }

                //Check if player click at items
                if(events["0"].status.type == "Item"){

                    if(events["0"].status.item == "HP_POTION"){
                        entitiesList = entitiesList.map(entity => {
                            if(entity.status.type == "Monster") entity.status.Health += 20
                            return entity
                        })
                    }else if(events["0"].status.item == "DAMAGE_POTION"){
                        entitiesList = entitiesList.map(entity => {
                            if(entity.status.type == "Monster") entity.status.Attack += (entity.status.Attack * 20 ) / 100
                            return entity
                        })
                    }else if(events["0"].status.item == "DEFENSE_POTION"){
                        entitiesList = entitiesList.map(entity => {
                            if(entity.status.type == "Monster") entity.status.Defense += (entity.status.Defense * 20 ) / 100
                            return entity
                        })
                    }else if(events["0"].status.item == "BOMB"){
                        entitiesList = entitiesList.map(entity => {
                            if(entity.status.type == "Human") entity.status.Health -= (entity.status.Health * 30) / 100 
                            return entity
                        })
                    }

                    //remove used item
                    entitiesList = entitiesList.filter(entity => {return entity.status.id != events["0"].status.id})


                }


            //Alphabet phase
            }else if(phase == "alphabet"){

                //Select alphabet
                //If click at input alphabet and the display alphabet
                if(events[0].name == "ALPHABET_CLICKED" && currentWord.length < 7 && !currentWordID.includes(events[0].id)){
                    currentWord += events["0"].status.letter
                    currentWordID.push(events[0].id)
                    events[0].status.selected = true
                    //Todo

                    let founded = findWord(currentWord)

                    console.log(founded)
                    if(founded == 0){
                        console.log("Not founded")
                        entitiesList = entitiesList.filter(entity => {return entity.status.button != "Confirm"})
                    } else if(entitiesList.filter(entity => {return entity.status.button == "Confirm"}).length == 0){
                        console.log("Founded and add once")
                        entitiesList.push(Entity.Button(engine, {x: 100, y: 200}, {width: 100, height: 30}, null, "Confirm"))
                    }
                    

                    didWordChange = true
                }else if(events[0].status.type == "Alphabet_SHOW"){
                    entitiesList = clearDisplayWordEntity(entitiesList) //Clear current displayed word
                }

                //Buttons
                if(events[0].status.type == 'Button'){
                    //IF Confirm button clicked
                    if(events[0].status.button == "Confirm"){
                        //Remove All current Words
                        entitiesList = entitiesList.filter(entity => {
                            return entity.status.type != "Alphabet"
                        })

                        submitWord.push(currentWord)
                        
                        //Check and apply buffs to current team members
                        //TODO

                        //Clear current displayed word and input
                        entitiesList = clearDisplayWordEntity(entitiesList)
                        entitiesList = clearWordEntity(entitiesList)

                        wordEntityGenerator(entitiesList)

                        //Pre-Generate new set of words
                        generateWord()
                        
                        console.log(submitWord) //DEBUG: show submit word
                    }
                    

                }
            }
            
        }


        //Humanity phases
        if(phase == "alphabet"){

            //Change if currentWord change or not to putting displayed words
            if(didWordChange){

                if(didWordChange){
                    for(let i=0; i<1; i++){
                        let newEntity = {} //Create empty object
                        for(let j=0; j<currentWord.length; j++) {
                            newEntity = Entity.Alphabet(engine, {x: Constants.MAX_WIDTH*0.265+(j*SIZE_BUTTON), y: Constants.MAX_HEIGHT*0.25+(i*SIZE_BUTTON)}, {width: SIZE_BUTTON, height: SIZE_BUTTON}, { id: currentWordID[j], letter: null, selected: false, type: "Alphabet_SHOW"}, currentWord[j]) //Assign key and entity to object
                            entitiesList.push(newEntity)
                        }
                    }
        
                    didWordChange = false
                }
    
            }

            if(time == 30){
                //Clear current displayed word and input
                entitiesList = clearDisplayWordEntity(entitiesList)
                entitiesList = clearWordEntity(entitiesList)
    
                //boost monster ATK for word completed
                entitiesList = getBonusATK(entitiesList, submitWord)
    
                //Put monsters available into attackQueue
                attackQueue = entitiesList.filter(entity => { return entity.status.type == "Monster" && entity.status.isAlive == true })
                
                changePhases("monster")
            }

        }else if(phase == "monster"){
            //TODO


        }else if(phase == "human"){
            //Random Attack algorithm below
            //TODO
            let humanAttackQueue = entitiesList.filter(entity => {
                return entity.status.type == "Human" && entity.status.isAlive == true
            })
            
            for(let i=0; i<humanAttackQueue.length; i++){
                let allMonster = entitiesList.filter(entity => {return entity.status.type == "Monster" && entity.status.isAlive == true})
                let randomPosition = Math.floor(Math.random() * allMonster.length)
                
                allMonster[randomPosition].status.Health -= 1

                //Check if monster dead yet
                if(allMonster[randomPosition].status.Health <= 0) allMonster[randomPosition].status.isAlive = false

                let monsterLeft = entitiesList.filter(entity => { return entity.status.type == "Monster" && entity.status.isAlive == true})
                if(monsterLeft.length == 0){

                    //mock gameLooping itself, no other stage yet
                    //-----------------------------------------
                    // changePhases("alphabet")
                    // return entitiesGenerator(engine, words)
                    //-----------------------------------------
                    
                    //Constants.stage = <whatever> here
                    changePhases("alphabet")
                    entitiesList = []
                    Constants.stage = "Menu"
                    initialGenerate = true
                    time = 0    
                    clearInterval(timer)
                    return {}

                }

                console.log(humanAttackQueue[i].status.id + " attack " + allMonster[randomPosition].status.id)
                console.log("HP: " + allMonster[randomPosition].status.Health +" isAlive: " + allMonster[randomPosition].status.isAlive + " isRested: " + allMonster[randomPosition].status.rested)
>>>>>>> Stashed changes
            }
        })
    }


    return entities
}