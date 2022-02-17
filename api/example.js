const {google} = require("googleapis");
const { auth } = require("googleapis/node_modules/google-auth-library");

exports.handler = async (event,context) => 
{
    try
    {
        const GOOGLE_SPREADSHEET_ID = process.env.ENV_CONTACT_SHEET_ID;

        const serviceAccountAuth = new google.auth.JWT({
            email: process.env.ENV_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.ENV_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
          });
        console.log(serviceAccountAuth);
        const client = await serviceAccountAuth.getClient();
        const googleSheets = google.sheets(
        {
            version:"v4",
            auth:"client"
        });
        const sheetmetadata = await googleSheets.spreadsheets.get(
        {
            auth:serviceAccountAuth,
            spreadsheetId : GOOGLE_SPREADSHEET_ID
        })
          
        let response = 
        {
            statusCode: 200,
            body: sheetmetadata
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