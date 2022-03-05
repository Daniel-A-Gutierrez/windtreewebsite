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
        
        const googleSheets = google.sheets(
        {
            version:"v4",
            auth:serviceAccountAuth
        });

        //read data provided by client
        console.log(event);
        let clientData = JSON.parse(event.body);
        console.log(clientData);

        //read data from google sheets (moonshot rn)
        const getRows = await googleSheets.spreadsheets.values.get(
        {
            auth:serviceAccountAuth,
            spreadsheetId:GOOGLE_SPREADSHEET_ID,
            range:clientData.className
        });

        console.log(getRows);

        //write data
        // await googleSheets.spreadsheets.values.append(
        // {
        //     auth:serviceAccountAuth, 
        //     spreadsheetId : GOOGLE_SPREADSHEET_ID,
        //     range:"Sheet1",
        //     valueInputOption:"USER_ENTERED",
        //     resource: {values:[['one','two','three']]}
        // }
        // );
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
            body: err
        };
        return response;
    }
}