# MTGBot2
In loving memory of MTGBot, who broke for reasons unknown.

This bot is as simple Slackbot that hangs out and looks for card names like "!Kird Ape" in your slack channel. When it sees one, the bot looks up the card and posts message to that channel with the card info. It also will do rule lookups like "100.12" when I get around to it.

To use it, you can just remix this project, add in your own Slack app secret data (in .env, you need VERIFICATION_TOKEN for the token Slack uses when it tests your events API subscription and OAUTH_TOKEN for sending data back to slack). Thats it.