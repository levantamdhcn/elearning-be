import fs from 'fs';
import path from 'path';

function writeFileRecursive(newPath, contents, cb) {
  fs.mkdir(path.dirname(newPath), { recursive: true }, function (err) {
    if (err) return cb(err);

    fs.writeFile(newPath, contents, cb);
  });
}

export default writeFileRecursive;
