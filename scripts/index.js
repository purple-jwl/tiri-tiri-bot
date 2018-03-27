'use strict';

const getCurry = () => {
  const menu = [
    'チャナ豆',
    'レンズ豆',
    'トマト',
    'ポーク',
    'チキン',
    'ピーンズ（チャナ豆＋レンズ豆）',
    'チーズ',
    'シュリンプ',
    'ミックス（トマト＋チーズ＋ホウレン草）',
  ];

  return menu[Math.floor(Math.random() * menu.length)];
};

const getExtras = n => {
  const menu = [
    'なま玉子',
    'ゆで玉子',
    'トマト',
    'チャナ豆',
    'レンズ豆',
    'ホウレン草',
    'レタス',
    'チーズ',
    'エビ',
  ];

  const extras = [];

  for (let i = 0; i < n; i++) {
    extras.push(menu[Math.floor(Math.random() * menu.length)]);
  }

  return extras;
};

module.exports = robot => {
  robot.hear(/カレー/, response => {
    response.send(':curry:');
  });

  robot.hear(/ルーレット/, response => {
    const message = getCurry() + 'カレー ＋ ' + getExtras(1) + 'トッピング';
    response.send(message);
  })
};
