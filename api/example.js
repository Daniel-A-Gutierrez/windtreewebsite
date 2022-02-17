const {google} = require("googleapis");
const { auth } = require("googleapis/node_modules/google-auth-library");

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

        //read metadata
        const googleSheets = google.sheets(
        {
            version:"v4",
            auth:serviceAccountAuth
        });
        const sheetmetadata = await googleSheets.spreadsheets.get(
        {
            auth:serviceAccountAuth,
            spreadsheetId : GOOGLE_SPREADSHEET_ID
        });
        console.log(JSON.stringify(sheetmetadata));
          
        //read data
        const getRows = await googleSheets.spreadsheets.values.get(
        {
            auth:serviceAccountAuth,
            spreadsheetId:GOOGLE_SPREADSHEET_ID,
            range:"Sheet1"
        });


        let response = 
        {
            statusCode: 200,
            body: JSON.stringify(getRows.data)
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