// Test harness
// Test runner provided by Jack Kingsman
var expectedRequirements;

var tests = {
    // Format
    name_separated_by_spaces: function(){
        return ["actual", "expected"]
    }
};

function runTests() {
    console.log('Beginning ' + Object.keys(tests).length + ' tests');

    // start with a fresh slate
    passcount = 0;
    failcount = 0;

    for (var name in tests) {
        var prettyName = name.replace(/_/g, ' ');

        // run test and ensure returned == expected

        //expectedRequirements = JSON.parse(localStorage.requirements);
        results = tests[name]();
        if (results[0] === results[1]) {
            console.log(prettyName + ' %cPASS', 'background: #222; color: #bada55');
            passcount++;
        } else {
            console.log(prettyName + ' %cFAIL', 'background: red; color: white');
            console.log('got ' + results[0] + ' and expected ' + results[1]);
            failcount++;
        }
    }

    console.log('----------------------------------------');
    console.log('----------------------------------------');

    // summarize
    if (failcount === 0) {
        console.log('%c' + passcount + ' tests passed (100% success)', 'background: #222; color: #bada55');
    } else {
        console.log('%c' + passcount + ' tests passed', 'background: #222; color: #bada55');
        console.log('%c' + failcount + ' tests failed', 'background: red; color: white');
    }
}

console.log('Test harness loaded...');
// give the ajax time to load
setTimeout(runTests, 1000);
