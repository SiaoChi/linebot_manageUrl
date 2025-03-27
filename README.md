![Google Script](https://img.shields.io/badge/Google%20Script-%E2%9C%93-yellowgreen)  
![JavaScript](https://img.shields.io/badge/JavaScript-%E2%9C%93-yellow)  
![Google Drive](https://img.shields.io/badge/Google%20Drive-%E2%9C%93-blue)  
![Line Linehook](https://img.shields.io/badge/Line%20Linehook-%E2%9C%93-lightgrey)  

# linebot_manageUrl
A LINE Bot app to manage a large number of website links. It uses the LINE official account webhook developer feature to create an app that suits personal website link management.

## You can find me here
LINE account : @966lpmni  or  click 🔗 url(https://line.me/R/ti/p/@966lpmni)
Try to type 「凱莉找git」 or 「凱莉找css」 or 「凱莉找python」 

## Main Features
1. Send messages in specific groups, such as “#docker https://docker.com” (“{tag} {url}”), and the information will be stored in the cloud Google Sheet.
2. In the official account, you can search by tag. Just type “凱莉找...” and fill in the information directly after the command without leaving any blanks.

## Development

### Programming Languages
- JavaScript

### Tools
- LINE WEBHOOK
- Google Script
- Google Sheet

## Demo 
#### Input storage command: tag + space + url
![Screenshot 2023-07-27 4 00 57 PM](https://github.com/SiaoChi/linebot_manageUrl/assets/98171354/df67f253-f56b-4134-ad23-4f4b70102f8c)

#### Input search command: 凱莉找
![Screenshot 2023-07-27 4 01 14 PM](https://github.com/SiaoChi/linebot_manageUrl/assets/98171354/c66dc101-207e-4072-b42e-2ec0d7ad3170)

#### deploy notice
- after done deploy on Google script, you have to copy the deploy link to LINE developer Messaging API settings, update the WEBHOOK URL, then you can try to test in chatbot.
