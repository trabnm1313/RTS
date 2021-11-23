import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system'

export default async () => {
  //Get information of directory & database from android app through FileSystem
  const directoryInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory+"SQLite")
  const databaseInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory+"SQLite/dictionaries.db")

  //If SQLite(default database directory) isn't exists then create one
  if ( !directoryInfo.exists ){
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite").then(()=>console.log("Created SQLite directory.")).catch(err=>console.log(err))

    //If there is no directory mean that there is no database either, so create one
    const [{ uri }] = await Asset.loadAsync(require("../assets/dictionary.db")) //GET local database file URI
    await FileSystem.downloadAsync(uri, FileSystem.documentDirectory + "SQLite/dictionaries.db").then(() => console.log("Database loaded.")).catch(()=>console.log(err))

  }else{
    //Log current directory infomation
    // console.log("SQLite Directory Exists: ", directoryInfo)

    //If database isn't exists then create one
    if( !databaseInfo.exists ){
      const [{ uri }] = await Asset.loadAsync(require("../assets/dictionary.db")) //GET local database file URI
      //Download local database into SQLite directory in android app
      await FileSystem.downloadAsync(uri, FileSystem.documentDirectory + "SQLite/dictionaries.db").then(() => console.log("Database loaded.")).catch(()=>console.log(err))
    }else{
      //Log current database in SQLite folder
      // console.log(databaseInfo)
    }
  }
}