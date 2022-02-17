require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet')
exports.handler = async (event,context) => 
{
    const GOOGLE_SPREADSHEET_ID = process.env.ENV_CONTACT_SHEET_ID;
    const doc = new GoogleSpreadsheet(GOOGLE_SPREADSHEET_ID)
    try 
    {
        await doc.useServiceAccountAuth(
        {
            client_email: process.env.ENV_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.ENV_GOOGLE_PRIVATE_KEY.replace('/\\n/g', '\n')
        });
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        const data = JSON.parse(event.body);
        const rows = await sheet.getRows();
        console.log({"doc":doc, "sheet":sheet, "rows":rows});
        let response;
        if (rows.some((row) => row.email === data.email)) 
        {
            response = 
            {
                statusCode: 400,
                body: 'The email is already in use'
            };
        return response;
        }
        await sheet.addRow(data);
        response = 
        {
            statusCode: 200,
            body: 'Thank you, your subscription has been completed!'
        };
        return response
    } 
    catch (err) 
    {
        console.error(err)
        response = 
        {
            statusCode: 500,
            body: 'Error, maybe the problem will be resolved later'
        }
    }
    return response
}

/*exports.handler = async function(event,context)
{
        //do fn
        /*{
    "path": "Path parameter (original URL encoding)",
    "httpMethod": "Incoming request’s method name",
    "headers": {Incoming request headers},
    "queryStringParameters": {Query string parameters},
    "body": "A JSON string of the request payload",
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encoded"
}

exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" }),
    };
}

const transporter = nodemailer.createTransport(
    mg({
        auth: {
            api_key: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN,
        },
    })
);
 

const auth = await google.auth.getClient({scopes:['https://www.googleapis.com/auth/spreadsheets.']})
}*/