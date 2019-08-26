# testcafe-browser-provider-perfecto

This is the **perfecto** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

## Install

```
npm install testcafe-browser-provider-perfecto

If TestCafe was installed globally (i.e. with the -g or --global options),
then this plugin must be installed the same way.

It is assumed that selenium-webdriver and perfecto-reporting are already installed.
```

## Usage

When you run tests from the command line, use the configuration file when specifying browsers:

```
testcafe perfecto:'path/to/configuration/file.json' 'path/to/test/file.js'
```

Sample configuration file:

```
{
      "platformName" : "Windows",
      "platformVersion" : "10",
      "browserName" : "Chrome",
      "browserVersion" : "72",
      "resolution" : "1280x1024",
      "location" : "US East"
}
```

The following environment variables should be defined:

```
PERFECTO_SECURITY_TOKEN='the security token'
PERFECTO_URL='url pointing to the cloud'
```

The following environment variables may be required:

```
PERFECTO_TUNNEL_ID='required if perfectoconnect is needed for browser to test machine connection'
PERFECTO_JOB_NAME='the job name'
PERFECTO_JOB_NUMBER='the job number'
PERFECTO_TEST_NAME='the test name as seen in the report'
PERFECTO_WEBDRIVER_PROXY='webdriver_proxy_host:port'
```

When you use API, pass the alias to the `browsers()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('perfecto:path/to/configuration/file.json')
    .run();
```

## Author
morrishoresh 
