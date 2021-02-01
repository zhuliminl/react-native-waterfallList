
export const randomColor = () => {
  let letters = '0123456789ABCDEF'
  let color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}


export const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}


// 生成卡片渲染所需要的数据
export const getRandomData = (size = 10) => {
  const data = [...Array(size)].map(item => {
    return {
      height: randomRange(300, 350),
      backgroundColor: randomColor(),
      title: generateRandomWords(20),
      imageUrl: getRandomImageUri()
    }
  })
  return data
}

export const guid = () => {
  function _p8(s) {
    var p = (Math.random().toString(16) + '000000000').substr(2, 8)
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p
  }
  return _p8() + _p8(true) + _p8(true) + _p8()
}


export const generateRandomWords = (count) => {
  var genCount = count >>> 0;

  var charCodes = [];
  for (var i = 0; i < genCount; ++i) {
    charCodes.push(randomRange(0x4E00, 0x9FBF));
  }

  return String.fromCharCode.apply(String, charCodes);
}

export const getRandomImageUri = () => {
  return `https://picsum.photos/200/300?random=${randomRange(2, 19)}`
}
