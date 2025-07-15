require("dotenv").config();
const { Client, GatewayIntentBits, Events, ChannelType } = require("discord.js");
const schedule = require("node-schedule");

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
]});

const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;
const threadOpenMsg = '# 기상시간 (주말+3시간)\n나래 11:30\n비월 09:30\n샛별 11:00';

client.once(Events.ClientReady, readyClient => {
    console.log(`✅ Logged in as ${readyClient.user.tag}`);

    //  test: 1분 간격으로 실행(매분마다)
    schedule.scheduleJob("0 * * * * *", async () => {
        try {
        const channel = await client.channels.fetch(TARGET_CHANNEL_ID);

        if (!channel || channel.type !== ChannelType.GuildText) {
            console.error("📛 채널을 찾을 수 없거나 텍스트 채널이 아닙니다.");
            return;
        }

        // 오늘 날짜 기반 제목 생성
        const now = new Date();
        const threadTitle = `${now.getMonth() + 1}월 ${now.getDate()}일`;

        // 스레드 만들기
        const thread = await channel.threads.create({
            name: threadTitle,
            autoArchiveDuration: 1440, // 하루 후 자동 숨김
        });

        await thread.send(threadOpenMsg);
        console.log(`📌 ${threadTitle} 스레드 생성 완료`);
        } catch (err) {
        console.error("에러 발생:", err);
        }
    });
})

client.login(process.env.DISCORD_TOKEN);



