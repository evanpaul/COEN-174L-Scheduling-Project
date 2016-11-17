// Test harness
// Boilerplate graciously provided by Jack Kingsman
var ACTIVE = "rgb(28, 219, 79)";
var INACTIVE = "rgb(255, 255, 255)";
var INCOMPLETE = "rgb(244, 241, 66)";

var tests = {
    double_dipper_and_edu_enrich: function() {
        // Add poli 2
        $("#entered_class").val("poli2");
        submitClass(true);
        var soc_before = $("#socsci").css("background-color"); // ACTIVE
        var cni3_before = $("#cni3").css("background-color"); // ACTIVE

        // Add econ2

        $("#entered_class").val("econ2");
        submitClass(true);
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
        submitClass(true);
        var elect1 = $("#elective").css("background-color"); // INCOMPLETE
        var electCount1 = ELECT_COUNT; // 1

        $("#entered_class").val("coen161");
        submitClass(true);
        var elect2 = $("#elective").css("background-color"); // INCOMPLETE
        var electCount2 = ELECT_COUNT; // 1

        $("#entered_class").val("coen162");
        submitClass(true);
        var elect3 = $("#elective").css("background-color"); // INCOMPLETE
        var electCount3 = ELECT_COUNT; // 2

        $("#entered_class").val("coen163");
        submitClass(true);
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
    },
    empty_input_on_submit: function() {
        $('#entered_class').val('testtesttest');
        submitClass(true);

        return [$('#entered_class').val(), ''];
    },
    save_and_retrieve: function() {
        var id = getID();
        var expected = enteredClasses;
        // Convert use flags to string for sake of comparison
        for (var i = 0; i < expected.length; i++) {
            course = expected[i];
            (course.used === true) ? (course.used = "true") : (course.used = "false");
        }
        expected = JSON.stringify(expected);
        // POST, GET, and verify result
        var result = '';
        $.ajax({
            type: "POST",
            url: "php/post.php",
            async: false,
            data: {
                "id": id,
                "classes": enteredClasses,
                "eduFlag": eduFlag
            },
            success: function() {
                $.ajax({
                    type: "GET",
                    url: "php/get.php",
                    async: false,
                    data: {
                        "id": id
                    },
                    success: function(d) {
                        result = JSON.parse(d).classes;
                    }
                });
            }
        });
        return [JSON.stringify(result), expected];
    }
};

function runTests(restore = true) {
    console.log('----------------------------------------');
    console.log('----------------------------------------');
    console.log('Beginning ' + Object.keys(tests).length + ' tests');

    // Start with a clean slate
    passCount = 0;
    failCount = 0;
    oldState = enteredClasses;
    if (restore) {
        console.log("Stashing state:", oldState);
    }
    enteredClasses = [];
    recheck();

    for (var name in tests) {
        var prettyName = name.replace(/_/g, ' ').toUpperCase();

        // run test and ensure returned == expected
        results = tests[name]();

        if (results[0] === results[1]) {
            console.log(prettyName + ' %cPASS', 'background: #222; color: #bada55');
            passCount++;
        } else {
            console.log(prettyName + ' %cFAIL', 'background: red; color: white');
            console.log("ACTUAL:");
            console.log(results[0]);
            console.log("EXPECTED:")
            console.log(results[1]);
            failCount++;
        }
    }

    console.log('----------------------------------------');
    console.log('----------------------------------------');

    // summarize
    if (failCount === 0) {
        console.log('%c' + passCount + ' tests passed (100% success)', 'background: #222; color: #bada55');
    } else {
        console.log('%c' + passCount + ' tests passed', 'background: #222; color: #bada55');
        console.log('%c' + failCount + ' tests failed', 'background: red; color: white');
    }
    // Restore session
    if (restore) {
        enteredClasses = oldState;
        recheck();
    }
}

console.log('Test harness loaded...');
// give the ajax time to load
setTimeout(runTests, 1000);
