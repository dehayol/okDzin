require('dotenv').config();

const discord = require('discord.js');
const client = new discord.Client();

const PREFIX = "!";
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

const BOISSONS = ["café", "thé", "bière", "cocktail", "boisson"];

function tokenlist(){
    let listOfTokens="";
    for(let i in TOKEN_TYPE){
        listOfTokens+= `**${i}** ` + ICONS[i] + ` ${TOKEN_TYPE[i]}` + "  ";
    }
    return listOfTokens;
}

const HELPMESSAGE = "besoin d'aide? Le format est `!okdzin 2c 2r 1f 1b 1a`\n" +
    tokenlist() + "\n(Je ne suis pas regardant sur les majuscules. Bisous.)";


client.on('ready', () =>{
    console.log('The bot has logged in')
});

client.on('message',(message)=>{
    if (message.author.bot ) return;

    if (message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
            .toLowerCase()
            .replace(/[.!?]$/,'')
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        if ((CMD_NAME === "okdzin") || (CMD_NAME === "od") ) {
            let tokens = new Array();
            let draw = 1;
            let result = {};
            let answer="";
            let level=0;

            // On commence par les boissons
            BOISSONS.forEach(function (i){
                if (args.includes(i)) {
                    console.log(args.includes(i));
                    message.react(ICONS[i])
                        .catch(console.error);
                }
            });


            if (args.length === 0) {
                message.reply(HELPMESSAGE);
                return;
            }

            // Check cheaters and display mode
            let cheat = false;
            args.forEach(arg =>{
                let cheater = arg.match(/^([1-9][0-9]{1,})([crfba])$/);
                if (cheater != null) {
                    cheat = true;
                }
            })

            if (cheat) {
                message.reply("Plus de 9 jetons d'une même couleur? Tricheur!");
                message.react("👎");
                return;
            } else {
                message.react("👍🏼");
            }


            // Create the bag of tokens
            args.forEach(arg =>{
                let token = arg.match(/^([1-9])([crfba])$/);
                console.log(token);
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

            answer = "\n**Total: "+level+" - Tirage: **"+answer;

            message.reply(answer);

        } else {
            return;
        }
    }
});


client.login(process.env.DISCORDJS_BOT_TOKEN);
