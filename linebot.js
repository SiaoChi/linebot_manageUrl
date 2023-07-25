

const token = GOOGLE_SHEET_TOKEN
const sheet_url = GOOGLE_SHEET_URL
const spreadSheet = SpreadsheetApp.openByUrl(sheet_url);
const kelly_list = spreadSheet.getSheetByName("1");
const rake_list = spreadSheet.getSheetByName("2");

function doPost(e) {
    const message = JSON.parse(e.postData.contents);
    const groupID = message.events[0].source.groupId;
    const replyToken = message.events[0].replyToken;
    const user_id = message.events[0].source.userId;
    const userMessage = message.events[0].message.text;


    const kelly_current_list_row = kelly_list.getLastRow()
    const rake_current_list_row = rake_list.getLastRow()

    let reply_message = "";
    const date = new Date();
    const formatDate = Utilities.formatDate(date, 'GMT+8', 'yyyy-MM-dd HH:mm');
    let data = [
        {
            "type": "text",
            "text": reply_message  // 將回覆訊息的初始值設置為空字串
        }];


    function send_to_line() {
        const url = LINE_REPLY_API_URL;
        UrlFetchApp.fetch(url, {
            'headers': {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + token,
            },
            'method': 'post',
            'payload': JSON.stringify({
                'replyToken': replyToken,
                'messages': data,
            }),
        });
    }


    function search_spreadsheet(userMessage) {
        const message_parts = userMessage.split("找");
        if (message_parts.length < 1) {
            return null;
        }
        const keyword = message_parts[1];

        const sheet = spreadSheet.getSheetByName("1");
        const last_row = sheet.getLastRow();
        const data = sheet.getRange(2, 3, last_row - 1, 3).getValues();

        // 抓取到的data長這樣是dict---> {Object[以欄位的資訊顯示][]}--> {["UIUX","URL"],["文章","URL"]}
        // item(row)獲取到的data item如上方，舉例顯示為["文章","網址"]
        let matching_data = data.filter(function (item) {
            return item[0].includes(keyword);
            // return row[0] === (keyword in row);
            // return row[0] === keyword;
        });

        if (matching_data.length === 0) {
            return null;
        }
        let response_message = "搜尋結果:\n\n";
        matching_data.forEach(function (row) {
            const row_index = data.indexOf(row) + 2; //查詢indexOf的意思
            const column_index = 3;  // URL固定在col3
            const tag = row[0];
            const url = row[1]; //列77 只有撈出["tag","url"] 所以row[1]==url
            const length_row = row.length;
            response_message += "標籤：" + tag + "\n網址：" + url + "\n\n";
            // response_message += "第 " + row_index + " 列，第 " + column_index + " 欄: " + url + "\n";
        });
        return response_message;
    }


    // 取得user帳號名稱
    function get_user_name() {
        const user_type = message.events[0].source.type;
        let nameUrl = "";
        switch (user_type) {
            case "user":
                nameUrl = LINE_PROFILE_API_URL + user_id;
                break;
            case "group":
                let groupid = message.events[0].source.groupId;
                nameUrl = LINE_GROUP_API_URL + groupid + "/member/" + user_id;
                break;
        }
        try {
            const response = UrlFetchApp.fetch(nameUrl, {
                "method": "GET",
                "headers": {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
            });
            const profile = JSON.parse(response.getContentText());
            let display_name = profile.displayName;
        }
        catch (error) {
            display_name = "not available";
        }
        return display_name;
    }

    const userName = get_user_name();
    const contion_1 = (groupID == GROUP_ID);  //在網站存檔群組
    const contion_2 = (groupID == GROUP_ID);  //在感恩日記群組
    const reply_1 = ["做得很好", "今天辛苦了！", "記起了～", "好的，祝你有個美好的一天"];
    const random_reply_1 = reply_1[Math.floor(Math.random() * reply_1.length)];  //隨機罐頭文字

    // 回應傳訊者的內容以及存檔雲端

    if (contion_1) {  //在網站存檔群組
        var info = userMessage.split(" ");
        kelly_list.getRange(kelly_current_list_row + 1, 1, 1, 4).setValues([[date, userName, info[0], info[1]]]); //存檔到googlesheet
        reply_message = reply_message.concat(userName + "已存檔"); // 將回覆訊息的初始值設置為空字串

    } else if (contion_2) {  //在感恩日記群組
        rake_list.getRange(rake_current_list_row + 1, 1, 1, 3).setValues([[date, userName, userMessage]]);  //存檔到googlesheet
        reply_message = reply_message.concat(random_reply_1); // 將回覆訊息的初始值設置為空字串

    } else if (userMessage.match(/^凱莉找.+$/)) {  //搜尋指令
        var search_result = search_spreadsheet(userMessage);
        if (search_result) {
            reply_message = search_result;

        } else {
            reply_message = "找不到符合的項目";

        }
    } else {
        reply_message = reply_message.concat("Hi " + userName + " 請輸入「凱莉找＿＿＿」，像是：凱莉找英文 我會給你相關資訊唷，一次請只給一個關鍵字！");

    }


    data[0].text = reply_message;  // 設置回覆訊息的內容
    send_to_line()
}