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
    //console.log("Schools : ");
    //console.log(data.school);
    let row = [
        data['student last name'],
        data['student first name'],
        data['student grade'],
        data['class selection'],
        data['transaction id'],
        data['parent email'],
        data['parent last name'] + ", " + data['parent first name'],
        data['parent phone'],
        data['allergies'],
        data['Conditions'],
    ];
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

async function decrementAvailability(auth,data,googleSheets)
{
    console.log("DATA");
    console.log(data);
    const GOOGLE_SPREADSHEET_ID = process.env.ENV_SCHOOLS_SHEET_ID;
    const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId:GOOGLE_SPREADSHEET_ID,
            range:"Classes"
        });
    let classes = getRows.data.values;
    console.log("CLASSES");
    console.log(classes);
    
    //get rows of classes student signed up for
    let matches = [];
    let availabilities = [];
    let log = [];
    for(let i = 0 ;i < classes.length;i++)
    {
        c = classes[i]
        let schoolMatch = c[0] === data["school"]
        let classMatch = data['class selection'].includes(c[1]);
        let gradeMatch = c[4].includes(data["student grade"]);
        log.push([i, schoolMatch, classMatch, gradeMatch]);
        if(schoolMatch & classMatch & gradeMatch ){
            matches.push(i);
            availabilities.push(c[3]);
        }
    }
    console.log("Match log");
    console.log(log);
    console.log("MATCHES");
    console.log(matches);
    console.log("Availabilities");
    console.log(availabilities);

    //convert those indeces to letters
    ranges = matches.map( (rownum) => `C${rownum}` );
    console.log("RANGES");
    console.log(ranges);
    for(let i = 0 ; i < ranges.length; i++)
    {
        let res = await googleSheets.spreadsheets.values.update(
            {
                // The A1 notation of the values to update.
                range: `Classes!${cell}`,
    
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                // How the input data should be interpreted.
                valueInputOption: 'USER_ENTERED',
            
                // Request body metadata
                requestBody: 
                {
                // request body parameters
                "range": `Classes!${ranges[i]}`,
                "values": [`${availabilities[i] - 1}`]
                },
            });
        console.log("RESPONSE");
        console.log(res);
    }
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
        console.log(data);
        //write data
        let master = addToMasterSheet(serviceAccountAuth,vals,googleSheets);
        let schools = addToAbridgedSheet(serviceAccountAuth,data,googleSheets); //needs names to parse
        
        await master;
        await schools;
        await decrementAvailability(serviceAccountAuth,data ,googleSheets);
        let response = 
        {
            statusCode: 200,
            headers : {'Content-Type' : 'text/html'},
            body: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Refresh" content="0; url='https://windtree.netlify.app/home'" />
                <title>Redirecting</title>
            </head>
            <body>
                
            </body>
            </html>`
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