const {google} = require("googleapis");
const { auth } = require("googleapis/node_modules/google-auth-library");

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

        const data = decode(event.body);
        let vals = Object.values(data);

        console.log(data);
        //write data
        await googleSheets.spreadsheets.values.append(
        {
            auth:serviceAccountAuth, 
            spreadsheetId : GOOGLE_SPREADSHEET_ID,
            range:"Sheet1",
            valueInputOption:"USER_ENTERED",
            resource: {values:[vals]}
        }
        )
        let response = 
        {
            statusCode: 200,
            body: 'form submitted'//JSON.stringify(data)
        };
        return response;
    }
    catch(err)
    {
        let response = 
        {
            statusCode: 500,
            body: encodeURI( err)
        };
        return response;
    }
}