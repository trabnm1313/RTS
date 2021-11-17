import { forEach, random } from "lodash";
import Constants from "../../Constants";
import Entity from "../entities/index";
// import { loadStatus } from "./opendatabase"

let engine = null;
let state1 = null; // render state checker

// from player
let money = 1000; // player's money
let pocket = []; // player's item
let monsterList = []; // player's monster team

// state in shop
let itemInshop = []; // random item list
let wannaRandom = true; // first time must be true
let itemFullLenght = 4; // can be change
let monterFullLenght = 4; // can be change
let price = {
  potion: 500,
  monster: 1000
} // price state

// Item that gonna random appear in shop (MUST BE CHANGE)
let allItem = [
  {
    type: "Monster",
    value: "Bat",
  },
  {
    type: "Monster",
    value: "Ghost",
  },
  {
    type: "Monster",
    value: "Goblin",
  },
  {
    type: "Item",
    value: "HP_POTION",
  },
];

// Buy function
// return LEFT MONEY
function buyingItem(money, cost, item) {
  let doHave = null; // checking state
  let isFull = null; // checking state

  // Can't have the same item in pocket
  if (item.type == "Item") {
    doHave = pocket.map((element) => {
      if (element.item == item.item) {
        return true;
      } else return false;
    });

    // is the pocket full
    isFull = pocket.length == pocketFullLenght ? true : false;
  } else if (item.type == "Monster") {
    // monster can be the same
    doHave = [false];
    // is the Team full
    isFull = monsterList.length == monterFullLenght ? true : false;
  }

  if (money < cost) {
    console.log("NOT ENOUGH MONEY");
    return money;
  } else if (doHave.includes(true)) {
    console.log("SAME");
    return money;
  } else if (isFull) {
    console.log("POCKET FULL");
    return money;
  } else {
    if (item.type == "Item") {
      pocket.push(item);
    } else if (item.type == "Monster") {
      monsterList.push(item);
    }

    state1 = null;
    return money - cost;
  }
}

// random item in shop function
// NO RETURN
function randomItem() {
  while (itemInshop.length < 9) {
    itemInshop.push(allItem[random(0, allItem.length - 1)]);
  }
}

// renderer
export default function (entities, args) {
  const events = args.events;

  let entitiesList = Object.values(entities);
  if (engine == null) engine = entitiesList[0].engine;

  // make it render just once time you want it run
  if (state1 === null) {
    console.log("rendered");
    state1 = "yes"; // checked state

    // the ramdom statement
    if (wannaRandom == true) {
      console.log("random");
      randomItem();
      wannaRandom = false;
    }

    // position of shop item that displayed
    let counter = 0; // position in itemInshop array
    let xCounter = 230; // starter x
    let yCounter = 10; // starter y

    // loop row
    for (let i = 0; i < 3; i++) {
      xCounter = 230; // can be change
      yCounter += 65; // can be change

      // loop display
      for (let j = 0; j < 3; j++) {
        if (itemInshop[counter].type == "Item") {
          entitiesList.push(
            Entity.Item(
              engine,
              { x: xCounter, y: yCounter },
              { width: 100, height: 60 },
              null,
              itemInshop[counter].value // MUST BE CHANGE
            )
          );
        } else if (itemInshop[counter].type == "Monster") {
          entitiesList.push(
            Entity.Monster(
              engine,
              { x: xCounter, y: yCounter },
              { width: 100, height: 60 },
              null,
              itemInshop[counter].value // MUST BE CHANGE
            )
          );
        }

        xCounter += 110;
        counter++;
      }
    }

    // display play's team
    monsterList.forEach((monster, index) => {
      if (index == 0) {
        entitiesList.push(
          Entity.Monster(
            engine,
            { x: 0, y: 0 },
            { width: 100, height: 60 },
            monster
          )
        );
      } else if (index == 1) {
        entitiesList.push(
          Entity.Monster(
            engine,
            { x: 0, y: 65 },
            { width: 100, height: 60 },
            monster
          )
        );
      } else if (index == 2) {
        entitiesList.push(
          Entity.Monster(
            engine,
            { x: 0, y: 130 },
            { width: 100, height: 60 },
            monster
          )
        );
      } else if (index == 3) {
        entitiesList.push(
          Entity.Monster(
            engine,
            { x: 0, y: 195 },
            { width: 100, height: 60 },
            monster
          )
        );
      }
    });
  }

  // Event Handler
  if (events.length > 0 && events[0].status != undefined) {
    let selected = events["0"].status;

    if (selected.type == "Item") {
      if (selected.item === "HP_POTION") {
        money = buyingItem(money, price.potion, selected);
        console.log(money);
      }
    } else if (selected.type === "Monster") {
      money = buyingItem(money, price.monster, selected);
      console.log(money);
    }
  }

  entities = { ...entitiesList };

  return entities;
}
