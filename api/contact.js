require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
    const GOOGLE_SPREADSHEET_ID = process.env.ENV_CONTACT_SHEET_ID;
    const doc = new GoogleSpreadsheet(GOOGLE_SPREADSHEET_ID);
    try 
    {
        await doc.useServiceAccountAuth(
        {
            client_email: process.env.ENV_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.ENV_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        });
        await doc.loadInfo();

        //const sheet = doc.sheetsByIndex[0];

        //now to try appending a row
        let request= new XMLHttpRequest();
        const data = decode(event.body);
        let vals = Object.values(data);
        request.open("POST",new URL(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SPREADSHEET_ID}/values/Sheet1:append`), false);
        vals = {"range" : "Sheet1",
            "majorDimension":"ROWS",
            "values": vals}
        request.send(encodeURI(vals));
        console.log(request);
        request.onload = (event)=>console.log(event);
        //console.log({"doc":doc, "sheet":sheet});
        //console.log(event);
        //console.log(decodeURI(event.body));
        //const data = JSON.parse(event.body);//not working because its url encoded not json!



        //const rows = await sheet.getRows();
        let response = 
        {
            statusCode: 200,
            body: JSON.stringify(data)
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