'use strict';

const getCurry = () => {
  const menu = [
    'チャナ豆',
    'レンズ豆',
    'トマト',
    'ポーク',
    'チキン',
    'ピーンズ（チャナ豆＆レンズ豆）',
    'チーズ',
    'シュリンプ',
    'ミックス（トマト＆チーズ＆ホウレン草）',
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

  return extras.join('＆');
};

const getExtraCount = () => (
  [0, 1, 1, 1, 1, 1, 1, 1, 2, 2][Math.floor(Math.random() * 10)]
);

module.exports = robot => {
  robot.hear(/^カレー$/, response => {
    response.send(':curry:');
  });

  robot.hear(/^今日のカレー$/, response => {
    const extraCount = getExtraCount();
    const message = getCurry() + 'カレー' + (extraCount ? (' ＋ ' + getExtras(extraCount) + 'トッピング') : '');
    response.send(message);
  });
};
