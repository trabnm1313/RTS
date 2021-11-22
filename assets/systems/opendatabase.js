import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'

let Data = null
let loadStatus = false

async function getData(){
  const db = SQLite.openDatabase("dictionary.db");

  return new Promise((resolve) => {
    //Making transaction
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT word FROM entries",
        [],
        (_, res) => {
          //Send it to resolve
          resolve(res)
        },
        (_, err) => console.log(err)
      )
    })
  })

}

async function openDatabase(){
  //Get information of directory & database from android app through FileSystem
  const directoryInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory+"SQLite")
  const databaseInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory+"SQLite/dictionary.db")

  //If SQLite(default database directory) isn't exists then create one
  if ( !directoryInfo.exists ){
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite").then(()=>console.log("Created SQLite directory.")).catch(err=>console.log(err))

    if(!databaseInfo.exists){
      const [{ uri }] = await Asset.loadAsync(require("../dictionary.db")) //GET local database file URI
      FileSystem.downloadAsync(uri, FileSystem.documentDirectory + "SQLite/dictionary.db").then(() => {
        console.log("Database loaded.")
        setTimeout(()=>{ parseData() }, 5000) 
      }).catch(()=>console.log(err))
    }
  }else{
    setTimeout(()=>{ parseData() }, 5000) 
  }
}

async function parseData(){
  Data = await getData()
  loadStatus = true
}

export {
  openDatabase,
  Data,
  loadStatus
}