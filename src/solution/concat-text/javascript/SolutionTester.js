var concatText = function() {
    var firstName = 'Kiều';
    var lastName = 'Trang';

    return `${firstName} ${lastName}`
}
const data = fs.readFileSync(file);

let lines = data.toString().split(/\r?\n|\r|\n/g);
lines = lines.map(line => line.trim());

for (let i = 0; i < lines.length; i = i + 2) {
  let s = '""';
  if (lines[i] != "null") {
    s = lines[i];
  }

  let expected = lines[i + 1];

  testcases.push({ s, expected });
}

let testresult = true;

let testresult = true;
for (let i = 0; i < testcases.length; i++) {
  const testcase = testcases[i];
  //console.log(testcase);
  let result = reverseString(testcase.s);
  //console.log("testcase.expected:", testcase.expected);
  if (!isEqual(testcase.expected, result)) {
    const message = `[Fail] ${testcase.s}; ${result}; ${testcase.expected}`;
    testresult = false;
    console.log(message);
    break;
  }
}

if (testresult) {
  const message =
    "[Success]Your solution passed all " + testcases.length + " test cases!";
  console.log(message);
}

function isEqual(expected, actualResult) {
    if(concatText.toString().includes('Kiều Trang')) {
        return false;
    }
    if(typeof actualResult !== 'string') {
        return false;
    }

    if(expected.localeCompare(other.trim()) !== 0) {
        return false;
    }

    return true;
}