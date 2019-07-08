import Promise from 'pinkie';
import * as fs from 'fs';

const webdriver = require('selenium-webdriver');
const reporting = require('perfecto-reporting');
var securityToken = process.env.PERFECTO_SECURITY_TOKEN;
var tunnelId = process.env.PERFECTO_TUNNEL_ID;
var perfectoUrl = process.env.PERFECTO_URL;
var jobName = process.env.PERFECTO_JOB_NAME;
var jobNumber = process.env.PERFECTO_JOB_NUMBER;
var testName = process.env.PERFECTO_TEST_NAME ? process.env.PERFECTO_TEST_NAME : 'TestCafe';

class Browser {
    constructor () {
        this.driver = null;
        this.reportingClient = null;
        this.success = true;
    }

    async close () {
        if (this.reportingClient) {
            if (this.success)
                await this.reportingClient.testStop({ status: reporting.Constants.results.passed });
            else
                await this.reportingClient.testStop({ status: reporting.Constants.results.failed });
        }

        if (this.driver)
            await this.driver.quit();

        this.reportingClient = null;
        this.driver = null;
    }
}


var browsers = {};

function loadConfig (filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) =>
            err ? reject(err) : resolve(JSON.parse(data))
        );
    });
}

export default {

    isMultiBrowser: true,

    async openBrowser (id, pageUrl, browserName ) {

        var browserConf = await loadConfig(browserName);

        if (securityToken) {
            var securityTokenCap = {
                'securityToken': securityToken
            };

            browserConf = Object.assign({}, securityTokenCap, browserConf);

        }

        if (tunnelId) {
            var tunnelIdCap = {
                'tunnelId': tunnelId
            };

            browserConf = Object.assign({}, tunnelIdCap, browserConf);

        }


        const driver = await new webdriver.Builder()
            .withCapabilities(browserConf)
            .usingServer(perfectoUrl)
            .build();

        browsers[id] = new Browser();
        browsers[id].driver = driver;

        var jobDetailMap = {};

        if (jobName)
            jobDetailMap.jobName = jobName;

        if (jobNumber) {
            try {
                jobDetailMap.buildNumber = parseInt(jobNumber, 10);
            }
            // eslint-disable-next-line no-empty
            catch (err) {
            }
        }

        var jobDetails = new reporting.Model.Job(jobDetailMap);

        const perfectoExecutionContext = new reporting.Perfecto.PerfectoExecutionContext( { webdriver: driver, job: jobDetails });

        browsers[id].reportingClient = new reporting.Perfecto.PerfectoReportingClient(perfectoExecutionContext);

        await browsers[id].reportingClient.testStart(testName + '-' + id, new reporting.Perfecto.PerfectoTestContext());


        await driver.get(pageUrl);
    },

    async closeBrowser (id) {

        if (!browsers[id])
            return;

        await browsers[id].close();

        browsers[id] = null;

    },

    async dispose () {
        var pending = [];

        for (const id in browsers) {
            if (!browsers[id])
                continue;
  
            pending.push(browsers[id].close());
            browsers[id] = null;
        }

        Promise.all(pending);

    },

    async canResizeWindowToDimensions (/* browserId, width, height */) {
        return true;
    },

    async resizeWindow (id, width, height /*, currentWidth, currentHeight*/) {

        if (!browsers[id])
            return;

        await browsers[id].driver.manage().window().setRect({ width: width, height: height });
    },

    async maximizeWindow (id) {

        if (!browsers[id])
            return;

        await browsers[id].driver.manage().window().maximize();
    },

    async reportJobResult (id, jobResult, jobData) {
        if (!browsers[id])
            return;

        if (jobResult !== this.JOB_RESULT.done || jobData.total !== jobData.passed)
            browsers[id].success = false;
    },


    async takeScreenshot (id, screenshotPath /*, pageWidth, pageHeight*/) {

        if (!browsers[id])
            return;

        await browsers[id].driver.saveScreenshot(screenshotPath);
    },

    async isLocalBrowser () {
        return false;
    }
};
