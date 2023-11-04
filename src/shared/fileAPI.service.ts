import fs from 'fs';
import path from 'path';
import { ncp } from 'ncp';

const getDirName = path.dirname;

(ncp as any).limit = 16;

export function getFile(lang: string, callback: any) {
  let file = '';
  const language = lang.toLowerCase();
  if (language === 'java') {
    file = path.join(__dirname, '../templates', 'Hello.java');
  } else if (language === 'c') {
    file = path.join(__dirname, '../templates', 'Hello.c');
  } else if (language === 'c++') {
    file = path.join(__dirname, '../templates', 'Hello.cpp');
  } else if (language === 'javascript') {
    file = path.join(__dirname, '../templates', 'Hello.js');
  } else if (language === 'python') {
    file = path.join(__dirname, '../templates', 'Hello.py');
  } else {
    callback('');
    return;
  }
  console.log(`getTemplate:${file}`);
  fs.readFile(file, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data.toString());
    callback(data.toString());
  });
}

export function createDirectory(path: string, callback: any) {
  if (!fs.existsSync(path)) {
    // create parent directories if they doesn't exist.
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) return callback(err);
      callback(
        null,
        '[Initialization]: Working direcotry is created in ' + path,
      );
    });
  } else {
    callback(null, '[Initialization]: Working direcotry exists in ' + path);
  }
}

export function saveFile(file, content, callback) {
  // create parent directories if they doesn't exist.
  fs.mkdir(getDirName(file), { recursive: true }, (err) => {
    if (err) {
      callback(err);
    } else {
      return fs.writeFile(file, content, (err2) => {
        if (err2) {
          callback(err);
        }

        callback();
      });
    }
  });
}

export function copyFile(source, target, callback) {
  let isCalled = false;

  const rd = fs.createReadStream(source);
  rd.on('error', function (err) {
    done(err);
  });
  const wr = fs.createWriteStream(target);
  wr.on('error', function (err) {
    done(err);
  });
  wr.on('close', function (result) {
    done(result);
  });
  rd.pipe(wr);

  function done(err) {
    if (!isCalled) {
      callback(err);
      isCalled = true;
    }
  }
}

export function copyDirectory(source, target, callback) {
  // create target directory if it doesn't exist.
  console.log(source);
  console.log(target);
  fs.mkdir(target, { recursive: true }, (err) => {
    if (err) return callback(err);

    ncp(source, target, function (err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  });
}

export function readFile(file, callback) {
  console.log('FileApi.readFile(), file:' + file);
  fs.readFile(file, function (err, data) {
    if (err) {
      console.log('FileApi.readFile(), err:' + err);
      throw err;
    }
    //console.log("FileApi.readFile(), data:" + data);
    callback(err, data + '');
  });
}
