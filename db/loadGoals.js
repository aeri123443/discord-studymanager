const path = require('path');
const db = require(path.join(__basedir, 'db/firebase.js'));

/**
 * 특정 채널의 유저 인포 리스트 반환
 * @param {string} channelId 
 * @returns user-info-object list
 */
async function getUserInfoInChannel(channelId) {
  try {
    // user 컬렉션의 모든 문서를 가져옴
    const usersCollectionRef = db.collection('channel').doc(channelId).collection('user');
    const snapshot = await usersCollectionRef.get(); 

    // 문서가 없으면 빈 배열 반환
    if (snapshot.empty) {
      console.log(`⚠️ '${channelId}' 채널에 데이터가 없습니다.`);
      return [];
    }

    // {UserID, 이름, 목표} 배열 생성
    const userDataList = [];
    snapshot.forEach(doc => {
      const data = doc.data();

      userDataList.push({
        id: doc.id,
        name: data.name || '이름 없음',
        goal: data.goal || '내용 없음'
      });
    });

    // console.log(`'${channelId}' 채널:`, userDataList);
    return userDataList;

  } catch (error) {
    console.error(`getUserInfoInChannel '${channelId}' 오류 발생:`, error);
    throw error;
  }
}

module.exports = {
  getUserInfoInChannel
};
