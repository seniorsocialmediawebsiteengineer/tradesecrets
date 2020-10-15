//  https://dev.to/sonyarianto/practical-puppeteer-how-to-upload-a-file-programatically-4nm4

const puppeteer = require('puppeteer');

(async () => {
    // set some options (set headless to false so we can see 
    // this automated browsing experience)
    let launchOptions = { headless: false, args: ['--no-sandbox'] };


    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // set viewport and user agent (just in case for nice viewing)
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    // go to the target web
    await page.goto('socialmedia.com');
	console.log('waiting for iframe with form to be ready.');
	await page.waitForSelector('iframe');
	console.log('iframe is ready. Loading iframe content');

	const elementHandle = await page.$(
		'#gauth-widget-frame-gauth-widget',
	);
	const frame = await elementHandle.contentFrame();
	
	// Loginto website
	await frame.waitFor(5000);
	await frame.type('#username', 'us@issss.io');
	await frame.waitFor(5000);
    await frame.type('#password', 'REDACTED');
	await frame.waitFor(1000);
	await frame.click('#login-btn-signin');
	console.log('wait for login');
	await frame.waitFor(20000);   
	/*
	// navigate to i,port from spreadsheet

	
    // get the selector input type=file (for upload file)
    await page.waitForSelector('#entriesButton');
    await page.waitFor(1000);

    // get the ElementHandle of the selector above
    //const inputUploadHandle = await page.$('#entriesButton');
	const inputUploadHandle = await page.$('input[type=file]');

    // prepare file to upload, I'm using test_to_upload.jpg file on same directory as this script

    // Sets the value of the file input to fileToUpload
    inputUploadHandle.uploadFile(fileToUpload);

    // doing click on button to trigger upload file
    await page.waitForSelector('#entriesButton');
    await page.evaluate(() => document.getElementById('entriesButton').click());

    // wait for selector that contains the uploaded file URL
    //await page.waitForSelector('#entriesButton');
    await page.waitFor(5000);

    */
	// Add flight path
    await page.goto('www.socialmedia.com');
	await page.waitFor(5000);
    
    const result = await page.$$eval('#ng-view > div:nth-child(5) > fg-logbook-table > div.logbook-table.logbook-layout.logbook-table-filters', rows => {
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            console.log(columns)
            return Array.from(columns, column => [column.innerText,column.childNodes[0].href])
        });

    });
    var i,j,temparray,chunk=52;
    var uploadlink;
    for(i=0,j=result[0].length; i <j; i+= chunk) {
        console.log(temparray)

        temparray = result[0].slice(i,i+chunk);
        if (temparray[1][0] == "2020-09-23" && temparray[11][0] == "10:07") {
            uploadLink = temparray[51][1];
            break
        }
    }

    await page.goto(uploadlink);

    const link = await page.$eval("input[type=file]");

   console.log(link);
    // close the browser
   // await browser.close();
})();
