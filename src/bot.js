require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();
const PREFIX = "!";
const TOKEN_TYPE = {
    "c": "Compétence",
    "r": "Risque",
    "f": "Foi",
    "b": "Bonus",
    "a": "Autre"
};

client.on('ready', () =>{
    console.log('The bot has logged in')
});

client.on('message',(message)=>{
    if (message.author.bot ) return;

    if (message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
            .toLowerCase()
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        if ((CMD_NAME === "okdzin") || (CMD_NAME === "od") ) {
            let tokens = new Array();
            let draw = 1;
            let result = {};
            let answer="";
            let level=0;

            if (args.length === 0) {
                message.reply("besoin d'aide? Le format est `!okdzin 1d 2c 2r 1f 1b 1a`\n"+
                "**C**: Compétence, **R**:Risque, **F**: Foi, **B**: Bonus, **A**: Autre\n"+
                "(Je ne suis pas regardant sur les majuscules. Bisous.)");
                return;
            }

            // Create the bag of tokens

            args.forEach(arg =>{
                let token = arg.match(/([1-9]+)([crfba])/);
                if (token != null) {
                    let num=parseInt(token[1]);
                    let letter=token[2];
                    if (letter === 'r'){
                        draw=num;
                    }
                    for (let i = 0; i<num; i++) {
                            tokens.push(letter);
                    }
                }
            })


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
            console.log(result);

            // Résultat
            for (let key in result) {
                answer += "\n**"+result[key]+"** "+TOKEN_TYPE[key]+"";
                if (result[key]>1 && key != "b") {
                    answer += "s"
                }

                level += result[key];
            }

            answer = "\n**Total: "+level+"**"+answer;

            message.reply(answer);

        } else {
            return;
        }
    }
});


client.login(process.env.DISCORDJS_BOT_TOKEN);
