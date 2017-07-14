const fs = require('fs');
const path = require('path');
const { remote: { dialog, getGlobal, getCurrentWindow } } = require('electron');
const conf = getGlobal('shared').conf;
const imagesPath = conf.get('imagesPath');
const imagesTree = conf.get('imagesTree');
let time;
let startTime;

const onInit = () => {
  const pathInput = document.getElementById('path');
  if(imagesPath && imagesTree) {
    pathInput.value = imagesPath;
    listImgDirs();
  }
  // validate form
}
const onAddImgPath = evt => {
  evt.preventDefault();

  const imgFolderPath = (dialog
    .showOpenDialog({
      title: 'Open parent image folder',
      properties: ['openDirectory']
    }) || []).shift();

  if (imgFolderPath && fs.existsSync(imgFolderPath)) {
    conf.set('imagesPath', imgFolderPath);
    const pathInput = document.getElementById('path');
    pathInput.value = imgFolderPath;
    conf.set('imagesTree', constructImgTree(imgFolderPath));
  }

  listImgDirs();
};

const constructImgTree = (parentDir, imgTree = {}) => {
  fs.readdirSync(parentDir).forEach(
    record => {
      const recordPath = `${parentDir}${path.sep}${record}`;
      if (fs.statSync(recordPath).isDirectory()) {
        constructImgTree(recordPath, imgTree);
      } else if (fs.statSync(recordPath).isFile()) {
        const currentDir = parentDir.split(path.sep).pop();
        Array.isArray(imgTree[currentDir]) ?
        imgTree[currentDir].push(record) : imgTree[currentDir] = [record];
      }
    }
  );
  return imgTree;
}

const listImgDirs = () => {
  const imgFolderElement = document.getElementsByClassName('img-folders')[0];
  const folderNames = Object.keys(conf.get('imagesTree'));
  folderNames.forEach( folderName => imgFolderElement.innerHTML += `<div class="ui checkbox">
    <input name="imgfolders" type="checkbox" value="${folderName}" checked>
   <label>${folderName}</label>
  </div>` )
}

const startPractice = (evt) => {
  evt.preventDefault();
  // const settings = {};
  const form = document.getElementById('form');
  const imgFolders = Array.from(form.elements.imgfolders)
    .filter(chkbx => chkbx.checked)
    .map(chkbx => chkbx.value);
  const imgArray = imgFolders.reduce((acc, imgFolder) => {
    return acc.concat(addFullPathToImg(imgFolder, imagesTree[imgFolder]));
  }, []);
  time = { minutes : +form.elements.minutes.value , seconds: +form.elements.seconds.value };
  
  document.getElementById('settings').style.display = 'none';
  document.getElementById('sketches').style.display = 'block';

  startTime = startTimer(time, updateImage(imgArray));
  startTime();
}

const addFullPathToImg = (folder, images) => {
  let imagesBasePath = imagesPath.split(path.sep).slice(0, -1).join(path.sep);
  if(`${imagesBasePath}${path.sep}${folder}` !== imagesPath) {
    imagesBasePath = imagesPath;
  }
  return images.map(image => `${imagesBasePath}${path.sep}${folder}${path.sep}${image}`);
}

const updateImage = (imgArray) => {
  const imgEl = document.getElementById('sketch');
  imgEl.setAttribute('src', imgArray[0]);
  let i = 1;
  return () => {
      if(i > imgArray.length -1) {
        window.alert('Lets start a new session');
        getCurrentWindow().reload();
      }
      imgEl.setAttribute('src', imgArray[i++]);
      imgEl.onload = () => { startTime() }
    }
}

const startTimer = (time, changeImg) => {
  return () => {
    timerTick(Object.assign({}, time), changeImg);
  }
}

const timerTick = (time, changeImg) => {
  const timerEl = document.getElementById('timer');
  timerEl.innerHTML = `${time.minutes}:${time.seconds}`;
  const intervalId = setInterval(() => {
    time.seconds--;
    if(time.minutes === 0 && time.seconds === 0) {
      clearInterval(intervalId);
      document.getElementById('sketches').style.visibility = 'hidden';
      document.body.style.backgroundColor = '#000';
      setTimeout(() => {
        document.body.style.backgroundColor = '#fff';
        document.getElementById('sketches').style.visibility = 'visible';
        changeImg();
      }, 2000);
    }
    if(time.seconds === 0 && time.minutes > 0) {
      time.minutes--;
    }
    timerEl.innerHTML = `${time.minutes}:${time.seconds}`;
  }, 1000);
}
 
module.exports = {
  // onPathAdd,
  onInit,
  onAddImgPath,
  startPractice
};