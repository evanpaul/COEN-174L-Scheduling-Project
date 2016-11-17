// Test harness
// Boilerplate graciously provided by Jack Kingsman
var ACTIVE = "rgb(28, 219, 79)";
var INACTIVE = "rgb(255, 255, 255)";
var INCOMPLETE = "rgb(244, 241, 66)";

var tests = {
    double_dipper_and_edu_enrich: function() {
        // Add poli 2
        $("#entered_class").val("poli2");
        submitClass();
        var soc_before = $("#socsci").css("background-color"); // ACTIVE
        var cni3_before = $("#cni3").css("background-color"); // ACTIVE

        // Add econ2

        $("#entered_class").val("econ2");
        submitClass();
        var ee_before = $("#econ2_ee").length; // 1

        // Remove poli 2
        removeClass("poli2");
        var soc_after = $("#socsci").css("background-color"); // ACTIVE
        var cni3_after = $("#cni3").css("background-color"); // INACTIVE
        var ee_after = $("#econ2_ee").length; // 0

        // Soc science should be lit, but CNI3 shouldnt... educational enrichment should update accordingly
        var actual = {
            "before": [soc_before, cni3_before, ee_before],
            "after": [soc_after, cni3_after, ee_after]
        };
        var expected = {
            "before": [ACTIVE, ACTIVE, 1],
            "after": [ACTIVE, INACTIVE, 0]
        };

        return [JSON.stringify(actual), JSON.stringify(expected)];
    },
    coen_electives: function() {
        var elect0 = $("#elective").css("background-color"); // INACTIVE
        var electCount0 = ELECT_COUNT; // 0

        $("#entered_class").val("coen161");
        submitClass();
        var elect1 = $("#elective").css("background-color"); // INCOMPLETE
        var electCount1 = ELECT_COUNT; // 1

        $("#entered_class").val("coen161");
        submitClass();
        var elect2 = $("#elective").css("background-color"); // INCOMPLETE
        var electCount2 = ELECT_COUNT; // 1

        $("#entered_class").val("coen162");
        submitClass();
        var elect3 = $("#elective").css("background-color"); // INCOMPLETE
        var electCount3 = ELECT_COUNT; // 2

        $("#entered_class").val("coen163");
        submitClass();
        var elect4 = $("#elective").css("background-color"); // ACTIVE
        var electCount4 = ELECT_COUNT; // 3

        removeClass("coen163");
        var elect5 = $("#elective").css("background-color"); // INCOMPLETE
        var electCount5 = ELECT_COUNT; // 2

        var actual = [
            [elect0, electCount0],
            [elect1, electCount1],
            [elect2, electCount2],
            [elect3, electCount3],
            [elect4, electCount4],
            [elect5, electCount5]
        ];
        var expected = [
            [INACTIVE, 0],
            [INCOMPLETE, 1],
            [INCOMPLETE, 1],
            [INCOMPLETE, 2],
            [ACTIVE, 3],
            [INCOMPLETE, 2]
        ];
        return [JSON.stringify(actual), JSON.stringify(expected)];
    }
};

function runTests(restore = true) {
    console.log('----------------------------------------');
    console.log('----------------------------------------');
    console.log('Beginning ' + Object.keys(tests).length + ' tests');

    // Start with a clean slate
    passcount = 0;
    failcount = 0;
    temp = enteredClasses;
    enteredClasses = [];
    recheck();

    for (var name in tests) {
        var prettyName = name.replace(/_/g, ' ').toUpperCase();

        // run test and ensure returned == expected
        results = tests[name]();

        if (results[0] === results[1]) {
            console.log(prettyName + ' %cPASS', 'background: #222; color: #bada55');
            passcount++;
        } else {
            console.log(prettyName + ' %cFAIL', 'background: red; color: white');
            console.log("ACTUAL:");
            console.log(results[0]);
            console.log("EXPECTED:")
            console.log(results[1]);
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
    // Restore session
    if (restore) {
        enteredClasses = temp;
        recheck();
    }
}

console.log('Test harness loaded...');
// give the ajax time to load
setTimeout(runTests, 1000);
