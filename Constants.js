import { Dimensions } from "react-native";
import React from "react"

let stage = "Shop"
let Level = 1
let team = []
let item = []

export default {
    MAX_WIDTH: Dimensions.get("screen").width - 100,
    MAX_HEIGHT: Dimensions.get("screen").height,
    stage,
    Level,
    team,
    item
}