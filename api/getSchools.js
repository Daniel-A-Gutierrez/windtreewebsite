const {google} = require("googleapis");
const { auth } = require("googleapis/node_modules/google-auth-library");

function parseSheet(arr = [])
{
    let data = {schoolName : arr[0], className : arr[1], availability : arr[2], price : arr[3], grades: arr[4]};
    console.log(`returning object  : ${data}`)
    return data;
}

exports.handler = async (event,context) => 
{
    try
    {
        //authenticate
        const GOOGLE_SPREADSHEET_ID = process.env.ENV_SCHOOLS_SHEET_ID;

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

        //read data from google sheets (moonshot rn)
        const getRows = await googleSheets.spreadsheets.values.get(
        {
            auth:serviceAccountAuth,
            spreadsheetId:GOOGLE_SPREADSHEET_ID,
            range:"Schools"
        });
        let rowData = getRows.data.values;
        rowData.shift();
        rowData = rowData.flat();
        console.log(`return data : ${rowData}`);

        /*[{
            className : 'innovative engineering',
            grades : [0,1,2],
            availability : 22,
            price : 100
        }]*/
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
            body: JSON.stringify(rowData)
        };
        return response;
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