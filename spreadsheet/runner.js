import { Spreadsheet } from "./index.js";


(async function() {
    const a = await Spreadsheet.init();
    console.log("Printing Available Sheets");
    const elements = a.getElements();
    console.log(elements);

    console.log("Initializing Characters");
    await Promise.all(elements.map(e => a.initCharasForElement(e)));

    // console.log(a.characters);

    console.log("getting chara info for zhongli")
    await a.initInfoForCharacter(a.characters['zhongli']);
    console.log(a.characters['zhongli'].roles)
    console.log(a.characters['zhongli'].notes)

    // console.log("getting chara info for eula")
    // await a.initInfoForCharacter(a.characters['eula']);
    // console.log(a.characters['eula'].roles)

    // console.log("getting chara info for cyno")
    // await a.initInfoForCharacter(a.characters['cyno']);
    // console.log(a.characters['cyno'].roles)

    // console.log("getting chara info for nilou")
    // await a.initInfoForCharacter(a.characters['nilou']);
    // console.log(a.characters['nilou'].roles)

    // console.log("getting chara info for yun jin")
    // await a.initInfoForCharacter(a.characters['yun jin']);
    // console.log(a.characters['yun jin'].roles)

    // console.log("getting chara info for geo traveler")
    // await a.initInfoForCharacter(a.characters['geo traveler']);
    // console.log(a.characters['geo traveler'].roles)

    // console.log("getting chara info for sucrose")
    // await a.initInfoForCharacter(a.characters['sucrose']);
    // console.log(a.characters['sucrose'].roles)


  }());