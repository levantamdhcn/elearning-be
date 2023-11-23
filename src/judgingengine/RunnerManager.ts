import { resolve, join, parse } from 'path';
import { copyDirectory, copyFile, saveFile } from '../shared/fileAPI.service';
import CRunner from './CRunner';
import CppRunner from './CppRunner';
import JavaRunner from './JavaRunner';
import JavaScriptRunner from './JavaScriptRunner';
import PythonRunner from './PythonRunner';
import appRoot from 'app-root-path';
import { ESubmissionLanguage } from 'src/submission/constants/submission';

function Factory() {
  this.createRunner = function createRunner(lang: ESubmissionLanguage) {
    let runner;

    switch (lang) {
      case ESubmissionLanguage.C:
        runner = new CRunner();
        break;
      case ESubmissionLanguage.CPP:
        runner = new CppRunner();
        break;
      case ESubmissionLanguage.JAVA:
        runner = new JavaRunner();
        break;
      case ESubmissionLanguage.JAVASCRIPT:
        runner = new JavaScriptRunner();
        break;
      case ESubmissionLanguage.PYTHON:
        runner = new PythonRunner();
        break;
      default:
        throw new Error('Invalid language');
    }
    return runner;
  };
}

export function run(question, lang, solution, callback) {
  const factory = new Factory();
  const runner = factory.createRunner(lang.toLowerCase());

  // copy all files in the question folder from solution folder
  const sourceDir = resolve(`${appRoot}`, 'src', 'solution', question);
  const targetDir = resolve(
    `${appRoot}`,
    'src',
    'judgingengine',
    'temp',
    question + '_' + lang + '_' + Math.floor(Date.now() / 1000),
  );

  // copy source code files
  copyDirectory(join(sourceDir, lang), targetDir, (err) => {
    if (err) {
      return { status: '99', result: String(err) };
    }

    const testCaseFile = join(targetDir, 'testCase.txt');
    // copy test case file
    copyFile(join(sourceDir, 'testCase.txt'), testCaseFile, (err) => {
      if (err) {
        return { status: '99', message: String(err) };
      }
      // save the solution to Solution.java
      const sourceFile = resolve(targetDir, runner.sourceFile());
      //console.log(`source file: ${sourceFile}`);
      const filename = parse(sourceFile).name; // main
      const extension = parse(sourceFile).ext; // .java

      //console.log(`filename: ${filename}`);
      //console.log(`extension: ${extension}`);
      if (lang == 'javascript') {
        // get method name and export it
        const method = solution
          .substring(solution.indexOf('var') + 4, solution.indexOf('='))
          .trim();
        solution = solution + ' ' + 'module.exports = ' + method + ';';
      }
      saveFile(sourceFile, solution, () => {
        const testFile = resolve(targetDir, runner.testFile());
        const testFileName = parse(testFile).name; // main
        runner.run(
          testFile,
          targetDir,
          testFileName,
          extension,
          function (status, message) {
            if (status == 'ok') {
              // no error
              console.log('message');
              console.log(message);
              if (message.startsWith('[Success]')) {
                return { status: 'pass', message: message.slice(9) };
              } else {
                return { status: 'fail', message: message.slice(6) };
              }
            } else {
              return { status, message };
            }
          },
        );
      });
    });
  });
}
