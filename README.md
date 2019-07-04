# testcafe-browser-provider-perfecto
[![Build Status](https://travis-ci.org/morrishoresh/testcafe-browser-provider-perfecto.svg)](https://travis-ci.org/morrishoresh/testcafe-browser-provider-perfecto)

This is the **perfecto** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

## Install

```
npm install testcafe-browser-provider-perfecto
```

## Usage


You can determine the available browser aliases by running
```
testcafe -b perfecto
```

When you run tests from the command line, use the alias when specifying browsers:

```
testcafe perfecto:browser1 'path/to/test/file.js'
```


When you use API, pass the alias to the `browsers()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('perfecto:browser1')
    .run();
```

## Author
morrishoresh 
