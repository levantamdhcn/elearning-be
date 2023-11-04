import { spawn } from 'child_process';
import Runner from './Runner';

class PythonRunner extends Runner {
  sourcefile = '';
  testfile = '';

  sourceFile() {
    return this.sourceFile;
  }
  testFile() {
    return this.testFile;
  }

  constructor() {
    super();
    this.sourcefile = 'Solution.py';
    this.testfile = 'SolutionTester.py';
  }

  run(file, directory, filename, extension, callback) {
    if (extension.toLowerCase() !== '.py') {
      console.log(`${file} is not a python file.`);
    }
    this.execute(file, directory, callback);
  }

  execute(file, directory, callback) {
    // set working directory for child_process
    const options = { cwd: directory };
    const argsRun = [];
    argsRun[0] = file;
    console.log(`options: ${options}`);
    console.log(`argsRun: ${argsRun}`);
    const executor = spawn('python', argsRun, options);
    executor.stdout.on('data', (output) => {
      const out = String(output);
      console.log(`pythonRunner->execute(): stdout:`);
      console.log(output);
      if (out.startsWith('[Success]') || out.startsWith('[Fail]')) {
        callback('ok', String(output)); // ok, no error
      }
    });
    executor.stderr.on('data', (output) => {
      console.log(`stderr: ${String(output)}`);
      callback('err_exe', String(output)); // err, execution failure
    });
    executor.on('close', (output) => {
      console.log(`stdout: ${output}`);
    });
  }
}

export default PythonRunner;
