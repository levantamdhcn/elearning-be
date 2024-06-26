import { spawn } from 'child_process';
import { parse } from 'path';

export function clang(srcfile: string, callback) {
  const file = `${__dirname}/${srcfile}`;
  console.log(file);
  const filename = parse(file).name; // main
  const extension = parse(file).ext; // .java
  if (extension === '.c') {
    const argsCompile: string[] = []; // ['codec.c', '-o','codec.out']
    argsCompile[0] = file;
    argsCompile[1] = '-o';
    argsCompile[2] = `${__dirname}/${filename}.out`;
    const cmdRun = `${__dirname}/${filename}.out`;
    this.execute(__dirname, 'gcc', argsCompile, cmdRun, [], callback);
  } else {
    console.log(`${file} is not a c file.`);
  }
}
export function java(srcfile, callback) {
  // if srcfile = 'main.java'
  console.log(`__dirname:${__dirname}`);

  const file = `${__dirname}/${srcfile}`;
  console.log(file);
  const filename = parse(file).name; // main
  const extension = parse(file).ext; // .java
  console.log(`filename:${filename}`);
  if (extension === '.java') {
    const argsCompile: string[] = [];
    argsCompile[0] = file;
    const argsRun: string[] = [];
    argsRun[0] = filename;
    console.log(argsRun);
    this.execute(__dirname, 'javac', argsCompile, 'java', argsRun, callback);
  } else {
    console.log(`${file} is not a java file.`);
  }
}
export function execute(
  currDirectory: string,
  cmdCompile: string,
  argsCompile: string[],
  cmdRun: string,
  argsRun: string[],
  callback: any,
) {
  const options = { cwd: currDirectory }; // set working directory for child_process
  console.log(`currDirectory: ${currDirectory}`);
  console.log(`cmdCompile: ${cmdCompile}`);
  console.log(`argsCompile: ${argsCompile}`);
  console.log(`cmdRun: ${cmdRun}`);
  console.log(`argsRun: ${argsRun}`);
  // var compile = spawn('gcc', ['codec.c', '-o','codec.out']);
  // var compile = spawn('javac', ['CodeJava.java']);
  const compile = spawn(cmdCompile, argsCompile);
  compile.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  compile.stderr.on('data', (data) => {
    console.log(`compile-stderr: ${String(data)}`);
    callback('1', String(data)); // 1, compile error
  });
  compile.on('close', (data) => {
    if (data === 0) {
      console.log(`cmdRun: ${cmdRun}`);
      const run = spawn(cmdRun, argsRun, options);
      run.stdout.on('data', (output) => {
        console.log(String(output));
        callback('0', String(output)); // 0, no error
      });
      run.stderr.on('data', (output) => {
        console.log(`stderr: ${String(output)}`);
        callback('2', String(output)); // 2, execution error
      });
      run.on('close', (output) => {
        console.log(`stdout: ${output}`);
      });
    }
  });
}
