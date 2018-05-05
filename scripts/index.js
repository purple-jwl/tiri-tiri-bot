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

const getExtraCount = () =>
  [0, 1, 1, 1, 1, 1, 1, 1, 2, 2][Math.floor(Math.random() * 10)];

module.exports = robot => {
  robot.hear(/^カレー$/, response => {
    response.send(':curry:');
  });

  robot.hear(/^今日のチリチリ$/, response => {
    const extraCount = getExtraCount();
    const message = `<@${response.message['user']['id']}> ${getCurry()}カレー${
      extraCount ? ' ＋ ' + getExtras(extraCount) + 'トッピング' : ''
    }`;
    response.send(message);
  });

  robot.hear(/^シャッフルランチ$/, async response => {
    const timeLimit = 5; // N分
    const lowerLimit = 4;

    const message = `
ランチに行きたい人は *${timeLimit}分以内* に何かしらのリアクションをつけて下さい :bento:
※全てのチームが *${lowerLimit}人以上* になるようにいい感じにチームを作ります。
`;

    const postedMessageInfo = await robot.adapter.client.web.chat.postMessage(
      response.message['room'],
      message,
      { as_user: true },
    );

    setTimeout(async () => {
      const res = await robot.adapter.client.web.reactions.get({
        timestamp: postedMessageInfo.ts,
        channel: postedMessageInfo.channel,
      });

      const uniqueUsers = Array.isArray(res.message['reactions'])
        ? [
            ...new Set(
              res.message['reactions'].reduce(
                (accumulator, currentValue) =>
                  accumulator.concat(currentValue.users),
                [],
              ),
            ),
          ]
        : [];

      for (let i = uniqueUsers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueUsers[i], uniqueUsers[j]] = [uniqueUsers[j], uniqueUsers[i]];
      }

      const teamCount = Math.floor(uniqueUsers.length / lowerLimit);

      if (teamCount === 0) {
        response.send('人数が少なかったため、ランチは延期です...');
      } else {
        const teams = [];
        for (let i = 0; i < teamCount; i++) {
          teams[i] = [];
        }

        for (let i = 0; i < uniqueUsers.length; i++) {
          teams[i % teamCount].push(uniqueUsers[i]);
        }

        const message =
          'これらのチームでランチに行きましょう！\n' +
          teams
            .map(
              (team, idx) =>
                `チーム${idx + 1}: ` + team.map(user => `<@${user}>`).join(' '),
            )
            .join('\n');

        response.send(message);
      }
    }, 1000 * 60 * timeLimit);
  });
};
