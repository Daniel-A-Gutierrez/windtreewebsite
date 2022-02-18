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


async function addToMasterSheet(auth, data, googleSheets)
{
    const GOOGLE_SPREADSHEET_ID = process.env.ENV_MASTER_SHEET_ID;
    await googleSheets.spreadsheets.values.append(
        {
            auth, 
            spreadsheetId : GOOGLE_SPREADSHEET_ID,
            range:"Master List",
            valueInputOption:"USER_ENTERED",
            resource: {values:[data]}
        }
        );
}

async function addToAbridgedSheet(auth,data,googleSheets)
{
    const schoolName = data.school;
    console.log("Schools : ");
    console.log(data.school);
    let row = [data.lastName];
    const GOOGLE_SPREADSHEET_ID = process.env.ENV_SCHOOLS_SHEET_ID;
    await googleSheets.spreadsheets.values.append(
        {
            auth, 
            spreadsheetId : GOOGLE_SPREADSHEET_ID,
            range:schoolName,
            valueInputOption:"USER_ENTERED",
            resource: {values:[row]}
        }
        );
}

exports.handler = async (event,context) => 
{
    try
    {
        //authenticate

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


        //write data
        let master = addToMasterSheet(serviceAccountAuth,vals,googleSheets);
        let schools = addToAbridgedSheet(serviceAccountAuth,data,googleSheets); //needs names to parse
        await master;
        await schools;
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