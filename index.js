require("dotenv").config();
const { Client, GatewayIntentBits, Events, ChannelType } = require("discord.js");
const schedule = require("node-schedule");
const path = require('path');

global.__basedir = __dirname;
const { getUserInfoInChannel } = require(path.join(__basedir, '/db/loadGoals.js')); 

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
]});

const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;

client.once(Events.ClientReady, readyClient => {
    console.log(`✅ Logged in as ${readyClient.user.tag}`);

    // 배포
    schedule.scheduleJob("0 15 * * *", async () => {
    // 테스트(매분마다)
    // schedule.scheduleJob("0 * * * * *", async () => {
        try {
        const channel = await client.channels.fetch(TARGET_CHANNEL_ID);
        
        let threadOpenMsg = '# 기상시간 (주말+3시간)';

        // 채널 내 유저 정보 가져오기
        getUserInfoInChannel(TARGET_CHANNEL_ID)
        .then(usersData => {
            console.log(`채널 '${TARGET_CHANNEL_ID}'에서 user info 가져오는 중...`)
            usersData.forEach(user => {
                threadOpenMsg += `\n ${user.name} ${user.goal}`
            });
            console.log(`threadOpenMsg: ${threadOpenMsg}`);
        })
        .catch(err => {
            console.error('사용자 이름-내용 가져오기 실패:', err);
        });

        if (!channel || channel.type !== ChannelType.GuildText) {
            console.error("📛 채널을 찾을 수 없거나 텍스트 채널이 아닙니다.");
            return;
        }

        // 오늘 날짜 기반 제목 생성
        const now = new Date();
        // const koreaTimeStr = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const threadTitle = `${koreaTime.getMonth() + 1}월 ${koreaTime.getDate()}일`;
        const koreaTimeStamp = `${koreaTime.getFullYear()}/${koreaTime.getMonth() + 1}/${koreaTime.getDate()} ${koreaTime.getHours()}:${koreaTime.getMinutes()}:${koreaTime.getSeconds()}`;
        // 스레드 만들기
        const thread = await channel.threads.create({
            name: threadTitle,
            autoArchiveDuration: 1440, // 하루 후 자동 숨김
        });

        await thread.send(threadOpenMsg);
        console.log(`📌 ${koreaTimeStamp}  ${threadTitle} 스레드 생성 완료`);
        } catch (err) {
        console.error("에러 발생:", err);
        }
    });
})

client.login(process.env.DISCORD_TOKEN);
