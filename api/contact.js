const {google} = require("googleapis");
const { auth } = require("googleapis/node_modules/google-auth-library");
const fetch = require('node-fetch');

function decode(s, q) {
    var i, p;
    s = s.replace(/\+/g, ' ').replace(/;/g, '&').split('&');
    q = q || {};
    for (i=0; i<s.length; i++) {
      p = s[i].split('=', 2);
      q[unescape(p[0])] = unescape(p[1]);
    }
    return q;
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data) 
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

exports.handler = async (event,context) => 
{
    try
    {
        //authenticate
        const GOOGLE_SPREADSHEET_ID = process.env.ENV_CONTACT_SHEET_ID;

        const serviceAccountAuth = new google.auth.JWT({
            email: process.env.ENV_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.ENV_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
          });

        const googleSheets = google.sheets(
        {
            version:"v4",
            auth:serviceAccountAuth
        });
        //put form data into js object
        const data = decode(event.body);
        let vals = Object.values(data);

        console.log(data);
        //verify form response with capcha
        const captcha_data = {secret:CAPTCHA_SECRET,response:data['g-recaptcha-response']};
        let captcha_api_response = await postData('https://www.google.com/recaptcha/api/siteverify', captcha_data);

        if(captcha_api_response && captcha_api_response.success)
        {
            //write data to sheets
            await googleSheets.spreadsheets.values.append(
            {
                auth:serviceAccountAuth, 
                spreadsheetId : GOOGLE_SPREADSHEET_ID,
                range:"Sheet1",
                valueInputOption:"USER_ENTERED",
                resource: {values:[vals]}
            })
            //respond to client with success
            let response = 
            {
                statusCode: 200,
                body: 'form submitted'//JSON.stringify(data)
            };
            return response;
        }
        throw captcha_api_response;
    }
    catch(err)
    {
        let response = 
        {
            statusCode: 500,
            body: encodeURI(err)
        };
        return response;
    }
}