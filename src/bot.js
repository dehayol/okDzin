require('dotenv').config();

const discord = require('discord.js');
const client = new discord.Client();

const PREFIX = "?";
const TOKEN_TYPE = {
    "c": "Compétence",
    "r": "Risque",
    "f": "Foi",
    "b": "Bonus",
    "a": "Autre"
};

const ICONS = {
    "c": "🔵", //blue
    "r": "🔴",    //red
    "f": "⚪", //white
    "b": "🟢", //green
    "a": "🔘", // gray
    "café": "☕",
    "thé": "🍵",
    "bière": "🍺",
    "boisson": "🧉",
    "cocktail": "🍹"
};

const BEVERAGES = ["café", "thé", "bière", "cocktail", "boisson"];

function tokenlist(){
    let listOfTokens="";
    for(let i in TOKEN_TYPE){
        listOfTokens+= `**${i}** ` + ICONS[i] + ` ${TOKEN_TYPE[i]}` + "  ";
    }
    return listOfTokens;
}

function commandOkdzin (message){
    const HELPMESSAGE = "besoin d'aide? Le format est `"+ PREFIX + "okdzin 2c 2r 1f 1b 1a`\n" +
        tokenlist() + "\n(Je ne suis pas regardant sur les majuscules. Bisous.)";

    let tokens = new Array();
    let draw = 1;
    let result = {};
    let answer="";
    let level=0;

    const [CMD_NAME, ...args] = message.content
        .toLowerCase()
        .replace(/[^\w\sÀ-ÿ]/g,' ')
        .replace(/0+([1-9])/g, "$1")
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

    console.log(args);

    if (args.length === 0) {
        message.reply(HELPMESSAGE);
        return;
    }

    // On commence par les boissons
    BEVERAGES.forEach(function (i){
        if (args.includes(i)) {
            message.react(ICONS[i])
                .catch(console.error);
        }
    });

    // Check cheaters
    let cheat = false;
    let risk = false;
    args.forEach(arg =>{
        let cheater = arg.match(/^([1-9][0-9]{1,})([crfba])$/);
        let isRisk = arg.match(/^[1-9]r$/);
        if (cheater != null) {
            cheat = true;
        }
        if (isRisk !=null) {
            risk = true;
        }
    })

    /*
        TODO: Check for duplicate tokens
    */

    if (cheat) {
        message.reply("Plus de 9 jetons d'une même couleur? Tricheur!");
        message.react("👎");
        return;
    } else if (!risk) {
        const noRiskTxt = [
            "Va faire caca dans les bois. Fais gaffe aux orties, quand-même!",
            "Refais ça et un tisseur t'efface de la trame de la réalité",
            "Pas de risque? Pas de tirage!"
        ];
        message.reply("Il n'y a pas de risque. " + noRiskTxt[Math.floor(Math.random() * noRiskTxt.length)]);
        message.react("👎");
        return;
    } else {
        message.react("👍🏼");
    }


    // Create the bag of tokens
    args.forEach(arg =>{
        let token = arg.match(/^([1-9])([crfba])$/);
        if (token != null) {
            let num=parseInt(token[1]);
            let letter=token[2];
            if (letter === 'r'){
                draw=num;
            }
            for (let i = 0; i<num; i++) {
                level++;
                tokens.push(letter);
            }
        }
    })

    if (tokens.length===0) {return;}

    // Tirage

    for (let i=0; i<draw; i++){
        pos=Math.floor(Math.random() * tokens.length);
        let token = tokens[pos];
        if (isNaN(result[token])){
            result[token] = 1;
        } else {
            result[token]=result[token]+1;
        }
        tokens.splice(pos,1);
    }

    // Résultat
    for (let key in result) {
        for (let k = 0; k<result[key] ; k++) {
            answer += ICONS[key] + " ";
        }
    }

    answer =  "\n**Total: "+level+" - Tirage: **"+answer;
    message.reply(answer);

}

function commandDDzin (args){

}






client.on('ready', () =>{
    console.log('The bot has logged in')
});

client.on('message',(message)=>{
    if (message.author.bot ) return;

    if (message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
            .toLowerCase()
            .substring(PREFIX.length)
            .split(/\s+/);


        if ((CMD_NAME === "okdzin") || (CMD_NAME === "od") ) {
            commandOkdzin(message);

        } else {
            return;
        }
    }

});


client.login(process.env.DISCORDJS_BOT_TOKEN);

/*
*
* Tu perds un point de compétence
*  */