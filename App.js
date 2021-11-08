import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
// import * as ScreenOrientation from "expo-screen-orientation";
// import WordTable from "./assets/entities/WordTable";
// import opendatabase from "./systems/opendatabase";
// import genWord from "./systems/genWord";
// import WordInput from "./assets/entities/WordInput";
// import findWord from "./systems/findWord";
import Time from "./assets/entities/Time";

export default function App() {
  // const [wordArray, setWordArray] = useState([]);
  // const [inputArray, setInputArray] = useState([])

  // Mounting database
  // useEffect(() => {
  //   opendatabase()
  //   changeScreenOrientation()
  // })

  // screen orient
  // async function changeScreenOrientation() {
  //   await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  // }

  // Call genword
  // async function generate() {
  //   setWordArray(await genWord())
  // }

  // add word from word table to word input
  function addWordInput(word) {
    let x = [...inputArray];
    x.push(word);
    setInputArray(x);
  }

  // clear wordInput array
  function clearWordInput(wantToclear) {
    if (wantToclear) {
      setInputArray([]);
    }
  }

  // handle Checking word in database
  // gonna upgrade to onchange but now its on click
  async function handleChange(txt) {
    // txt is array of word => ["R", "W", "S"] gonna make it to normal string with join() function
    let gonnaCheck = txt.join("");

    // let check the word now
    let isWord = await findWord(gonnaCheck);
    if (isWord == 0) {
      console.log("No word in database");
    } else console.log(gonnaCheck + " is a word.");
  }

  return (
    <View style={styles.container}>
      <Time />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
