const path = require('path');
const util = require('util');
const fs = require('fs');
const request = require('request');
const XLSX = require('xlsx');
const pg = require('pg-node2');
const moment = require('moment');

const config = require('../config');

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const input = {
  db: new pg.PGP(config.db2),
  eventId: 107,
  project: 'SG',
  baseDir: './SG',
  userNames: [], // 녹음을 다운로드할 유저 리스트. 여기에서 명시하지 않을 경우 checkColumn을 통해 판별하게 됨
  userNameColumn: 'User name',
  checkColumn: '2차 납품',
  userInfoSource: './[Sensory] PJT_Speakers.xlsx'
};

const getUserDataFromExcel = (source) => {
  const workbook = XLSX.readFile(source);
  const workSheet = workbook.Sheets['PJT5 KO'];
  return XLSX.utils.sheet_to_json(workSheet);
};

const filterUserData = ({ userNames, userNameColumn, checkColumn, users }) => {
  if (!userNames.length && !checkColumn) throw new Error('can not set users');

  const filterFunc = (userNames.length) ? user => userNames.includes(user.username)
    : user => user.checkCol;

  const ret = [];
  users.forEach((row) => {
    const {
      [userNameColumn]: username,
      [checkColumn]: checkCol,
      Name: realName,
      Gender: gender,
      Age: age,
      Nationality: nationality,
      City: city
    } = row;
    const user = { username, checkCol, realName, gender, age, nationality, city };
    if (filterFunc(user)) ret.push(user);
  });

  return ret;
};

const getDataFromDbForEachUser = ({ db, eventId, username }) => {
  // execute query
};

const makeDir = async (dirPath) => {
  try {
    await mkdir(dirPath);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
};

const getRecordSrcUrl = ({ url, cf }) => {
  let srcUrl = `${path.dirname(url)}/zr_${path.basename(url)}`;
  if (cf.use) srcUrl = srcUrl.replace(cf.s3_url, cf.host);
  return srcUrl;
};

const getRecordDstPath = ({ userDir, userId, sid, etc, srcUrl }) => {
  const ext = path.extname(srcUrl);
  let dst = `${userDir}/${userId}_${sid}`;
  if (etc) dst += `_${etc}`;
  dst += ext;
  return dst;
};

const writeSessionFile = ({ user, userDir, startTime }) => {
  const randomMinutes = 20 + Math.round(Math.random() * 5);
  const randomSeconds = Math.round(Math.random() * 60);
  const endTime = new Date(startTime.getTime() + (randomMinutes * 60 * 1000) + (randomSeconds * 1000));
  const utcStartTime = moment(startTime).utc();
  const utcEndTime = moment(endTime).utc();

  const content = `start_time ${utcStartTime}\n` +
    `end_time ${utcEndTime}\n` +
    `gender ${user.gender === '여성' ? 'female' : 'male'}\n` +
    `age ${user.age}\n` +
    `location ${user.city}, ${user.nationality}\n` +
    `name ${user.realName}\n` +
    'target_language ko\n';

  return writeFile(`${userDir}/session.txt`, content);
};

const writePhraseFile = ({ project, userDir, rows }) => {
  let phrase = '';
  rows.forEach(({ content, filename }) => {
    const prefix = filename.split('.')[0];
    phrase += `${prefix} {{${content}} {${project}/${filename}}}\n`;
  });

  return writeFile(`${userDir}/phraselist.txt`, phrase);
};

const downloadRecordForEachUser = ({ userDir, userId, rows }) => {
  return rows.map(async (row) => {
    const { sid, etc, tr_content_url } = row;
    const src = getRecordSrcUrl({ url: tr_content_url, cf: config.cloudfront });
    const dst = getRecordDstPath({ userDir, userId, sid, etc, srcUrl: tr_content_url });
    row.filename = path.basename(dst);

    const stream = request.get(src).pipe(fs.createWriteStream(dst));
    await new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log(`Complete download ${userId}_${sid}`);
        resolve();
      });
      stream.on('error', (err) => reject(err));
    });
  });
};

const processForEachUser = async ({ db, eventId, baseDir, project, users }) => {
  for (const user of users) {
    const { username } = user;
    const { rows } = await getDataFromDbForEachUser({ db, eventId, username });
    const { user_id: userId, tr_date: startTime } = rows[0];
    const userDir = `${baseDir}/${userId}`;
    await makeDir(userDir);

    const downloadPromises = downloadRecordForEachUser({ userDir, userId, rows });
    await Promise.all(downloadPromises);

    const sessionPromise = writeSessionFile({ user, userDir, startTime });
    const phrasePromise = writePhraseFile({ project, userDir, rows });
    await Promise.all([sessionPromise, phrasePromise]);

    console.log(`${userId} user complete`);
  }
};

(async ({ db, eventId, project, baseDir, userNames, userNameColumn, checkColumn, userInfoSource }) => {
  try {
    await makeDir(baseDir);

    let users = getUserDataFromExcel(userInfoSource);
    const filterOpt = { userNames, userNameColumn, checkColumn, users };
    users = filterUserData(filterOpt);
    console.log(`total user: ${users.length}`);

    await processForEachUser({ db, eventId, baseDir, project, users });
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await db.end();
    console.log('script end');
  }
})(input);
