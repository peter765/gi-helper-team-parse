
export const a = "hello"
import {GoogleSpreadsheet} from 'google-spreadsheet';

export class Spreadsheet {
    constructor(doc) {
        this.doc = doc;
        this.characters = {}
    }

    static async init() {
        // Initialize the sheet - doc ID is the long id in the sheets URL
        const doc = new GoogleSpreadsheet('1gNxZ2xab1J6o1TuNVWMeLOZ7TPOqrsf3SshP5DLvKzI');
        //https://docs.google.com/spreadsheets/d/1gNxZ2xab1J6o1TuNVWMeLOZ7TPOqrsf3SshP5DLvKzI/edit#gid=2001372201
        
        // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
        await doc.useServiceAccountAuth({
          // env var values are copied from service account credentials generated by google
          // see "Authentication" section in docs for more info
          client_email: 'genshin-bot@personal-340005.iam.gserviceaccount.com',
          private_key: 	"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDL+8N8Wp/LDNmt\n/ZrfxXtsl69m9s5wsC/UNWKcwzKbUk69Ljq8uWxjy7vnNJoidgIHEPTY//TMyosS\nVhxkddTtusouIBy0eJgWRdvSxzON3FbxuMTOTem89KJRs1hgfWMfz7+3N9LirgDz\n5p1xiGRvk5xxrGYA9haxhrhByMKAwAfq/thfru64H1dk6xP5ALVuUvJkShZbNPhy\nK4kU1NVl7y3JltUYLkPoU2tgB2HWVXuZLnw/jiKx/BCsbRmZYbaIvWtes9BxQA5k\nB13ZcRc6BM7wt2m1iYXogZ0yckJ3MTowlk6qUx2x7hVq67sLf2zsTWiKE5d+2i6/\nZR1lWdm/AgMBAAECggEAHntxc4hRX7T8ZIlE1xK6RniGYCMap3FUvGf75AQxcE+E\n77VUVrZ40ZL08fCE5ghvdiHdDP521RGhZayTkpmfJ6VlqC3pTDjHNXDcECvvctAN\n+BJN6qxu9OszxHTCDK1AHlVbx2PisjghcVExjvE8XQYYd041cghUTNQefcoj8rw7\nQyuRWBGlDyPSCpDTSjhFVMLT9IQMPqFIcs14UuYyc5CghzS/utaAVgqbAfJmV6Ht\nvK6MCVWNp35jfiZ1i+tVJjDrjIBA70Xs7YA5pn/GKodQvoz3ehbyuiTvvZQ7w+ej\nGKajSOhoBf91D6/IN/ZWIUGTXLQC5kqkT1v8fXabuQKBgQDpA4hYlTx51U/U1ThZ\nDxsbB3JV57Rxb8Am1leScjignUngs6DCBnunE4NLzbgmTwtDPHGPIYT04t3y7Ogs\nFlFqxHX1dPdffgPtWm3aGP4EHqLRx3MfH5rQvHut8JgrJ/b2sAokdQXCV/r+UJE3\n5Hg3pLUNp+atkuo0hV4wy5GxtwKBgQDgGxtCBNf67GGCUONDLd8vOlgXMN7eNqjm\nd0y9LvDqg4eyBA+xcqTl01ZtovndkXOC6Ph0MqG0dDB0IEOMCjWihif4DVFIaBiw\n+miQXxSt9tb/HLN56QhlE8Y1dImjCT2pbTy29Oo13pH+EgGI8vgmMdC47Vp/tS/B\ngNhVgED4OQKBgQDXT6pXoF7nfVJtKjENKkYzrafa9WXpRAfcW0dETUNCNtUjSxiK\n8Q6ljgROsWMuEvAnStzsE18WIeRRKtRGmMDW1X7iNxi2Jm1ej6beVyWxjNWK3q/j\n3IJjyybFzYHurtknjfdxRKjzsfR9ttjZOsZTNGEQo0smrJC5w1sL369a9QKBgQC+\nyFS8L0Nu6i1Ys2PFnReTLSgxFfmlUwMWsBk0NPIDs1WhxrNVbTPUM8YwL75nUZv0\npkBdK31eEkvtkEnwvgBLC8qa8TtxWK0sfQDnZwpDzw/YvqZL8oajBeKHP16s3QER\na110o6t/kKrYkJud6ro2SdJWnDme3rB5GycQIs8sgQKBgHCsh4wp+2avnrVCejmp\nc7/urRJVRJWoyJlukN6Zp4su1VRwlWQJ2WHpfKvgqjgHc/sgkMovcmk1mwQby6ux\nRa+njuWiyDgpJzI+c+7SVrv+P5fi0rnEOdXDPBxJ/tLh7BMzgATnUsTW/rWfJAXe\n73E++7di0VVTErYxstlUHkAG\n-----END PRIVATE KEY-----\n",
        });
        
        await doc.loadInfo(); // loads document properties and worksheets
        console.log(doc.title);
        

        return new Spreadsheet(doc);
    }

    getElements(){
        const elements = this.doc.sheetsByTitle;
        delete elements['Changelogs '];
        delete elements['Title '];
        delete elements['Credits '];
        return Object.keys(elements);
    }

    async initInfoForCharacter(character) {
        const elementSheet = this.doc.sheetsByTitle[character.element];
        if (!character.endRow){ 
            character.endRow = elementSheet.rowCount;
        }
        const range = `B${character.startRow}:I${character.endRow+1}`;
        console.log(range);
        await elementSheet.loadCells(range); // Character Names are in Column B
        character['notes'] = elementSheet.getCellByA1(`C${character.endRow}`).value;
        const roles = []
        for (let i = character.startRow; i < character.endRow; i++) {
            const roleName = elementSheet.getCellByA1(`C${i}`).value;
            if(!roleName || roleName.toLowerCase() == "role" || roleName.length > 80){
                continue;
            }
            const roleWeapons = elementSheet.getCellByA1(`D${i}`).value;
            const roleArtifact = elementSheet.getCellByA1(`E${i}`).value;
            const roleArtifactStat = elementSheet.getCellByA1(`F${i}`).value;
            const roleArtifactSubstat = elementSheet.getCellByA1(`G${i}`).value;
            const roleTalent = elementSheet.getCellByA1(`H${i}`).value;

            const roleInfo = {
                role: roleName,
                weapons: roleWeapons,
                artifacts: {
                    set: roleArtifact,
                    mainStats: roleArtifactStat,
                    subStats: roleArtifactSubstat
                },
                talentPriority: roleTalent,
            }
            roles.push(roleInfo)
        }
        character['roles'] = roles
    }

    async initCharasForElement(element) {
        const elementSheet = this.doc.sheetsByTitle[element];
        await elementSheet.loadCells({startColumnIndex: 1, endColumnIndex: 2 }); // Character Names are in Column B
        let isFiveStar = false;
        let prevCharacter = null;
        // indexing from 1 to match spreadsheet rows
        for(let i = 5; i < elementSheet.rowCount; i++) {
            const characterCell = elementSheet.getCell(i, 1);
            if (!characterCell.value){
                continue;
            }
            const text = characterCell.value.toLowerCase();
            if (!text.includes("notes") && !text.includes("4 star")){
                let characterName = `${text}`; // Messy, but readable? idk 
                if (prevCharacter) {
                    prevCharacter.endRow = i; 
                }

                if (text.includes("5 star")) { // Inconsistent formatting 
                    isFiveStar = true
                    prevCharacter.endRow = i-2;
                    continue;
                }
                if (characterName == "traveler") {
                    characterName = `${element.toLowerCase().trim()} traveler`
                }


                this.characters[characterName] = {startRow: i+1, element, isFiveStar}
                prevCharacter = this.characters[characterName]
            }
        }
        console.log("Initialized", element);
    }

    printRowCount() {
        const sheet = this.doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        console.log(sheet.title);
        console.log(sheet.rowCount);
    }

    printHelloWorld() {
        console.log("Hello, World");
    }
}

