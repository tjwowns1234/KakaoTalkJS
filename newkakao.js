/* 
    KRU연맹 몬축카카오톡 봇JS.   LohaasLove 제작
    최근 릴리즈 날짜 : 2019.09.16
*/

// Global Variables
// Frequently Used Variables
let isExistRoomName = false;
let isExistUserName = false;
let isRoomAlive = false;

// Variables for JSON DataBase
let contents = '';
let objTrial = [];
let strTrial = '';
let fileName = 'kru';

// response Function
function response(room, msg, sender, isGroupChat, replier, imageDB) {
    /** @param {String} room - 방 이름
     * @param {String} msg - 메세지 내용
     * @param {String} sender - 발신자 이름
     * @param {Boolean} isGroupChat - 단체채팅 여부
     * @param {Object} replier - 세션 캐싱 답장 메소드 객체
     * @param {Object} imageDB - 프로필 이미지와 수신된 이미지 캐싱 객체
     * @method imageDB.getImage() - 수신된 이미지가 있을 경우 Base64 인코딩 되어있는 JPEG 이미지 반환, 기본 값 null
     * @method imageDB.getProfileImage() - Base64 인코딩 되어있는 JPEG 프로필 이미지 반환, 기본 값 null
     * @method replier.reply("문자열") - 메시지가 도착한 방에 답장을 보내는 메소드 */


    /*
        Admin   : 관리자
        User    : 관리자를 포함한 대화방의 모든 참여자
    */

    // Admin
    if (msg.indexOf('/initialization') != -1) {
        // mj.json에 현재 trailList를 저장
        let tmp = [];
        contents = JSON.stringify(tmp);
        DataBase.setDataBase(contents,fileName);

        // mj.json 값 읽어오기
        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);

        replier.reply('init\n');
    }

    if (msg.indexOf('/공지') != -1) {
        // /공지 방이름 내용~~~
        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);

        let op = msg.trim().replace(/ +/g, " ").split(' ');
        let roomName = op[1]; // 방이름
        let i,j = 0;

        if (roomName === undefined || roomName === '' || roomName === null) {
            // 방이름이 undefined, '', null, ' ' 일경우
            replier.reply("[System]\n형식을 맞춰주세요.\nex)/공지 방이름 내용");
        } else {
            // 정상적으로 방이름이 입력 되었을 때
            for (i = 0; i < objTrial.length; i++) {
                // 입력 된 roomName을가지고 해당되는 방이 있는지 검색
                if (objTrial[i].name === undefined || objTrial[i].name === '') {
                    isRoomAlive = false;
                    break;
                } else if (roomName == objTrial[i].name) {
                    isRoomAlive = true;
                    // 방이름이 존재하는 경우. 해당 방의 공지를 저장
                    for (j = 0, len = op.length; j < len; j++) {
                        op[j] = msg.indexOf(op[j]);
                    }
                    if (op.length < 3) {
                        replier.reply("[System]\n공지 내용을 입력 하세요.")
                    } else {
                        let tempidx = op[2];
                        let temp = msg.slice(tempidx);

                        objTrial[i].notice = "공지 ->\n " + temp + "\n";

                        let result = objTrial[i].name + "방에 공지가 등록 되었습니다.\n내용:" + objTrial[i].notice.slice(0,
                            objTrial[i].notice.length / 2) + "...";

                        replier.reply("[System] :" + result);

                        // mj.json에 현재 trailList를 저장
                        contents = JSON.stringify(objTrial);
                        DataBase.setDataBase(contents, fileName);
                    }
                    break;
                } else {
                    isRoomAlive = false;
                }
            }
        }
        if (isRoomAlive == false) {
            // 방이름이 존재하지 않는 경우
            replier.reply("[System]\n그런 방은 존재하지 않습니다.(공지)");
        }
    }

    if (msg.indexOf('/변경') != -1 || msg.indexOf('/수정') != -1) {
        // /변경 원래방이름 바꿀방이름 바꿀일시 바꿀연맹명~~~
        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);

        let i,j,k = 0; // 인덱스
        let op = msg.trim().replace(/ +/g, " ").split(' ');
        let roomName = op[1]; // 방이름

        if (roomName === undefined || roomName === '' || roomName === null) {
            // 방이름이 undefined, '', null, ' ' 일경우
            replier.reply("[System]\n형식을 맞춰주세요.\nex)/변경 방이름 바꿀방이름 바꿀일시 바꿀연맹명");
        } else {
            // 정상적으로 방이름이 입력 되었을 때
            for (i = 0; i < objTrial.length; i++) {
                // 입력 된 roomName을가지고 해당되는 방이 있는지 검색
                if (objTrial[i].name === undefined || objTrial[i].name === '') {
                    isRoomAlive = false;
                    break;
                } 
                else if (roomName == objTrial[i].name) {
                    // 방이름이 정상적으로 있다면
                    isRoomAlive = true;
                    // 방이름이 존재하는 경우. 해당 몬축방의 이름, 일시, 연맹명 변경
                    // op[2]:바뀔 방이름 op[3]:바뀔 일시 op[4]:바뀔 연맹명
                    if (op[2] === undefined || op[2] === '' || op[2] === null ||
                        op[3] === undefined || op[3] === '' || op[3] === null ||
                        op[4] === undefined || op[4] === '' || op[4] === null) {
                        replier.reply("[System]\n형식을 맞춰주세요.\nex)/변경 방이름 바꿀방이름 바꿀일시 바꿀연맹명");
                    } 
                    else {
                        // 현재방을 제외하고 나머지 방들에 대해 같은 이름이 있는지 확인
                        for (j =0 ; j < i ; j++) {
                            if (objTrial[j].name == op[2] || objTrial[j].name === undefined) {
                                isExistRoomName = true; // 생성불가 상태
                            }
                        }
                        for (k =i+1 ; k < objTrial.length ; k++) {
                            if (objTrial[k].name == op[2] || objTrial[k].name === undefined) {
                                isExistRoomName = true; // 생성불가 상태
                            }
                        }
                        if (isExistRoomName == false){
                            let result = roomName + "방의 내용이 변경 되었습니다."+
                            "\n원본내용 : " + objTrial[j].name + ' / ' + objTrial[j].datetime + ' / ' + objTrial[j].guildName;
                            objTrial[j].name = op[2];
                            objTrial[j].datetime = op[3];
                            objTrial[j].guildName = op[4];
                            result += "\n변경내용 : " + objTrial[j].name + ' / ' + objTrial[j].datetime + ' / ' + objTrial[j].guildName;
    
                            replier.reply("[System] :\n" + result);
    
                            // mj.json에 현재 trailList를 저장
                            contents = JSON.stringify(objTrial);
                            DataBase.setDataBase(contents ,fileName);
                        }
                        else {
                            replier.reply("[System]\n이미 존재하는 방이름 입니다.");
                            isExistRoomName = false;
                            break;
                        }
                    }
                    break;
                }
                else {
                    isRoomAlive = false;
                }
            }
        }
        if (isRoomAlive == false) {
            // 방이름이 존재하지 않는 경우
            replier.reply("[System]\n그런 방은 존재하지 않습니다.");
        }
    }

    if (msg.indexOf('/마감') != -1) {
        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);

        let op = msg.trim().replace(/ +/g, " ").split(' ');
        let roomName = op[1]; // 방이름
        let i = 0;

        if (roomName === undefined || roomName === '' || roomName === null) {
            // 방이름이 undefined, '', null 일경우
            replier.reply("[System]\n형식을 맞춰주세요.\nex)/마감 방이름");
        } else {
            // 정상적으로 방이름이 입력 되었을 때
            for (i = 0; i < objTrial.length; i++) {
                // 입력 된 roomName을가지고 해당되는 방이 있는지 검색
                if (objTrial[i].name === undefined || objTrial[i].name === '') {
                    isRoomAlive = false;
                    break;
                } else if (roomName == objTrial[i].name) {
                    isRoomAlive = true;
                    // 방이름이 존재하는 경우. 해당 몬축방 지원을 제한
                    if (objTrial[i].state != "0") {
                        replier.reply("[System]\n현 시간부로 " + objTrial[i].name + "몬축방은 마감 되었습니다.");
                        objTrial[i].state = "0";
                        // mj.json에 현재 trailList를 저장
                        contents = JSON.stringify(objTrial);
                        DataBase.setDataBase(contents, fileName);
                        break;
                    } else {
                        break;
                    }
                } else {
                    isRoomAlive = false;
                }
            }
            if (isRoomAlive == false) {
                // 방이름이 존재하지 않는 경우
                replier.reply("[System]\n그런 방은 존재하지 않습니다.(마감)");
            }
        }
    }

    if (msg.indexOf('/마감해제') != -1) {
        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);
        
        let op = msg.trim().replace(/ +/g, " ").split(' ');
        let roomName = op[1]; // 방이름
        let i = 0;

        if (roomName === undefined || roomName === '' || roomName === null) {
            // 방이름이 undefined, '', null 일경우
            replier.reply("[System]\n형식을 맞춰주세요.\nex)/마감해제 방이름");
        } else {
            // 정상적으로 방이름이 입력 되었을 때
            for (i = 0; i < objTrial.length; i++) {
                // 입력 된 roomName을가지고 해당되는 방이 있는지 검색
                if (objTrial[i].name === undefined || objTrial[i].name === '') {
                    isRoomAlive = false;
                    break;
                } else if (roomName == objTrial[i].name) {
                    isRoomAlive = true;
                    // 방이름이 존재하는 경우. 해당 몬축방 지원을 제한
                    replier.reply("[System]\n현 시간부로 " + objTrial[i].name + "몬축방은 마감해제 되었습니다.");
                    objTrial[i].state = "1";

                    // mj.json에 현재 trailList를 저장
                    contents = JSON.stringify(objTrial);
                    DataBase.setDataBase(contents, fileName);
                    break;
                } else {
                    isRoomAlive = false;
                }
            }
            if (isRoomAlive == false) {
                // 방이름이 존재하지 않는 경우
                replier.reply("[System]\n그런 방은 존재하지 않습니다.(마감해제)");
            }
        }
    }

    if (msg.indexOf('/생성') != -1) {

        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);

        let splitMsg = msg.trim().replace(/ +/g, " ").split(' ');
        let i = 0;

        if (msg == '/생성') {
            replier.reply('[System]\nex) /생성 방이름 일시 연맹명\n방이름 일시 연맹명등 각 단어들은 띄어쓰기 금지. 꼭 붙여쓰세요.');
        }
        if (splitMsg[1] !== undefined && splitMsg[1] !== ' ' && splitMsg[2] !== undefined && splitMsg[3] !== undefined) {
            // 중복이름 검증
            for (i =0 ; i< objTrial.length ; i++) {
                if (objTrial[i].name == splitMsg[1] || objTrial[i].name === undefined) {
                    isExistRoomName = true; // 생성불가 상태
                }
            }
            if (isExistRoomName == false) {
                // 방 생성 -> JSON 으로 저장
                let d = new Date();
                let yyyy = d.getFullYear();
                let MM = d.getMonth()+1;
                let DD = d.getDate();
                let hh = d.getHours();
                let mm = d.getMinutes();
                let day = d.getDay();
                let dayArr = ['일', '월', '화', '수', '목', '금', '토'];
                let now = yyyy + "년 " + MM +"월 " + DD+ "일"+ "("+ dayArr[day] +"요일)" + hh+ "시 " + mm +"분"; 
                let info = {
                    "name" : splitMsg[1],
                    "datetime" : splitMsg[2],
                    "guildName" : splitMsg[3],
                    "notice" : "공지 미입력\n",
                    "users" : new Array(),
                    "state" : "1",
                    "now" : now,
                    "creator" : sender
                };
                objTrial.push(info);

                contents = JSON.stringify(objTrial);
                DataBase.setDataBase(contents, fileName);
                strTrial = DataBase.getDataBase(fileName);
                objTrial = JSON.parse(strTrial);
                replier.reply("[System]\n생성 된 방이름 : " + splitMsg[1]);
            } 
            else {
                replier.reply("[System]\n이미 존재하는 방이름 입니다.");
                isExistRoomName = false;
            }
        } else {
            replier.reply('[System]\n형식에 맞게 적어주세요.\nex) /생성 이름 일시 연맹명');
        }
    }

    if (msg.indexOf('/제거') != -1 || msg.indexOf('/삭제') != -1) {

        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);

        let op = msg.trim().replace(/ +/g, " ").split(' ');
        let roomName = op[1]; // 방이름
        let i = 0;

        if (roomName === undefined || roomName === '' || roomName === null) {
            // 방이름이 undefined, '', null 일경우
            replier.reply("[System]\n형식을 맞춰주세요.\nex)/참가 방이름");
        } else {
            // 정상적으로 방이름이 입력 되었을 때
            for (i = 0; i < objTrial.length; i++) {
                // 입력 된 roomName을가지고 해당되는 방이 있는지 검색
                if (objTrial[i].name === undefined || objTrial[i].name === '') {
                    isRoomAlive = false;
                    break;
                } else if (roomName == objTrial[i].name) {
                    isRoomAlive = true;
                    // 방이름이 존재하는 경우. 해당 몬축방을 제거
                    let idx = objTrial.map(x => {
                        return x.name;
                    }).indexOf(objTrial[i].name);
                    objTrial.splice(idx, 1);
                    replier.reply("[System]\n" + roomName + " 몬축방이 삭제 되었습니다.");
                    // mj.json에 현재 trailList를 저장
                    contents = JSON.stringify(objTrial);
                    DataBase.setDataBase(contents, fileName);
                } else {
                    isRoomAlive = false;
                }
            }
            if (isRoomAlive == false) {
                // 방이름이 존재하지 않는 경우
                replier.reply("[System]\n그런 방은 존재하지 않습니다.");
            }
        }
    }

    if (msg == "/초기화" || msg == "/리셋") {
        isExistRoomName = false;
        isExistUserName = false;
        isRoomAlive = false;
        replier.reply("[System]\n모든 몬축방이 삭제 되었습니다.");
        // mj.json에 현재 trailList를 저장
        let tmp = [];
        contents = JSON.stringify(tmp);
        DataBase.setDataBase(contents,fileName);
    }

    // User
    if (msg.indexOf('/참가') != -1 || msg.indexOf('/참여') != -1 || msg.indexOf('/지원') != -1) {

        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);

        let op = msg.trim().replace(/ +/g, " ").split(' '); // /참가 [방이름] op[0] : 참가, op[1] : 방이름
        let roomName = op[1]; // 방이름
        let i,j = 0;

        if (roomName === undefined || roomName === '' || roomName === null) {
            // 방이름이 undefined, '', null 일경우
            replier.reply("[System]\n형식을 맞춰주세요.\nex)/참가 방이름");
        } else {
            // 정상적으로 방이름이 입력 되었을 때
            for (i = 0; i < objTrial.length; i++) {
                // 입력 된 roomName을가지고 해당되는 방이 있는지 검색
                if (objTrial[i].name === undefined || objTrial[i].name === '') {
                    isRoomAlive = false;
                    break;
                } else if (roomName == objTrial[i].name) {
                    isRoomAlive = true;
                    // 방이름이 존재하는 경우. 해당 방에서 지원자의 이름이 중복이 되는지 검색
                    for (j = 0; j < objTrial[i].users.length; j++) {
                        if (objTrial[i].users[j] === sender) { // 등록되어 있는 경우
                            isExistUserName = true;
                            break;
                        } else if (objTrial[i].users[j] === undefined) {
                            isExistUserName = false;
                        } else {
                            isExistUserName = false;
                        }
                    }
                    if (isExistUserName != true) { // 방에 등록되어있지 않은경우
                        if (objTrial[i].state == "0") {
                            replier.reply("[System]\n" + objTrial[i].name + "몬축방이 마감되어 해당 방은 지원하실 수 없습니다.");
                            break;
                        } else {
                            objTrial[i].users.push(sender);
                            replier.reply("[System]\n" + sender + "님이 " + objTrial[i].name + "방에 등록 되었습니다.");
                            // mj.json에 현재 trailList를 저장
                            contents = JSON.stringify(objTrial);
                            DataBase.setDataBase(contents,fileName);
                            break;
                        }
                    } else {
                        if (objTrial[i].state == "0") {
                            replier.reply("[System]\n" + objTrial[i].name + "몬축방이 마감되어 해당 방은 지원하실 수 없습니다.");
                            break;
                        } else {
                            replier.reply("[System]\n" + sender + "님은 이미 " + objTrial[i].name + "방에 등록되어 있습니다.");
                            isExistUserName = false;
                            break;
                        }
                    }
                } else {
                    isRoomAlive = false;
                }
            }
            if (isRoomAlive == false) {
                // 방이름이 존재하지 않는 경우
                replier.reply("[System]\n그런 방은 존재하지 않습니다.");
            }
        }
    }

    if (msg.indexOf('/불참') != -1) {

        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);
        
        let useridx = 0;
        let op = msg.trim().replace(/ +/g, " ").split(' '); // /참가 [방이름] op[0] : 참가, op[1] : 방이름
        let roomName = op[1]; // 방이름
        let i,j = 0;

        if (roomName === undefined || roomName === '' || roomName === null) {
            // 방이름이 undefined, '', null 일경우
            replier.reply("[System]\n형식을 맞춰주세요.\nex)/불참 방이름");
        } else {
            // 정상적으로 방이름이 입력 되었을 때
            for (i = 0; i < objTrial.length; i++) {
                // 입력 된 roomName을가지고 해당되는 방이 있는지 검색
                if (objTrial[i].name === undefined || objTrial[i].name === '') {
                    isRoomAlive = false;
                    break;
                } else if (roomName == objTrial[i].name) {
                    isRoomAlive = true;
                    // 방이름이 존재하는 경우. 해당 방에서 지원자의 이름이 중복이 되는지 검색
                    for (j = 0; j < objTrial[i].users.length; j++) {
                        if (objTrial[i].users[j] === sender) { // 등록되어 있는 경우
                            isExistUserName = true;
                            useridx = j;
                            break;
                        }
                    }
                    if (isExistUserName != true) { // 방에 등록되어있지 않은경우
                        replier.reply("[System]\n" + sender + "님은 " + objTrial[i].name + "방에 없습니다.");
                        break;
                    } else {
                        if (objTrial[i].state == "0") {
                            replier.reply("[System]\n" + objTrial[i].name + "몬축방은 마감 되어 불참으로 변경이 불가합니다.");
                            break;
                        } else {
                            objTrial[i].users.splice(useridx, 1);
                            replier.reply("[System]\n" + sender + "님이 " + objTrial[i].name + "방에서 불참 되었습니다.");
                            isExistUserName = false;
                            j = 0;
                            // mj.json에 현재 trailList를 저장
                            contents = JSON.stringify(objTrial);
                            DataBase.setDataBase(contents, fileName);
                            break;
                        }
                    }
                } else {
                    isRoomAlive = false;
                }
            }
            if (isRoomAlive == false) {
                // 방이름이 존재하지 않는 경우
                replier.reply("[System]\n그런 방은 존재하지 않습니다.");
            }
        }
    }

    if (msg.indexOf('/목록') != -1) {
        // mj.json 값 읽어오기
        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);
        let i,j = 0;

        if (objTrial.length < 1) {
            replier.reply("[System]\n몬축방이 존재하지 않습니다.");
        }
        if (msg == '/목록') {
            let display = "===총 개수 : " + objTrial.length + "===";
            for (i = 0; i < objTrial.length; i++) {
                display +="\n\n방이름 : " + objTrial[i].name + "\n" +
                    "일　시 : " + objTrial[i].datetime + "\n" +
                    "연맹명 : " + objTrial[i].guildName + "\n" +
                    "참가자 : " + objTrial[i].users + "\n" +
                    objTrial[i].notice+
                    "\n생성일시 : "+objTrial[i].now+
                    "\n생성자 : "+objTrial[i].creator;
            }
            replier.reply("[System]\n" + display);
        } else {
            let op = msg.trim().replace(/ +/g, " ").split(' ');
            let roomName = op[1]; // 방이름

            // 정상적으로 방이름이 입력 되었을 때
            for (i = 0; i < objTrial.length; i++) {
                // 입력 된 roomName을가지고 해당되는 방이 있는지 검색
                if (objTrial[i].name === undefined || objTrial[i].name === '') {
                    isRoomAlive = false;
                    break;
                } else if (roomName == objTrial[i].name) {
                    isRoomAlive = true;
                    if (objTrial[i].users.length < 1) {
                        replier.reply("[System]\n" + objTrial[i].name + "방에는 아무도 없습니다.");
                        break;
                    } else {
                        // 방이름이 존재하는 경우. 해당 몬축방의 참가자들을 모두 출력
                        let temp = "";
                        temp += objTrial[i].name;
                        temp += "방의 현재 참가자 목록(";
                        temp += objTrial[i].users.length;
                        temp += "명)\n";
                        temp += "연맹명 : ";
                        temp += objTrial[i].guildName;
                        temp += "\n\n";
                        for (j = 0; j < objTrial[i].users.length; j++) {
                            temp += objTrial[i].users[j] + "\n";
                        }
                        temp += "\n"+objTrial[i].notice;
                        temp += "\n생성일시 : "+objTrial[i].now;
                        temp += "\n생성자 : "+objTrial[i].creator;
                        replier.reply("[System]\n" + temp);
                        break;
                    }

                } else {
                    isRoomAlive = false;
                }
            }
            if (isRoomAlive == false) {
                // 방이름이 존재하지 않는 경우
                replier.reply("[System]\n그런 방은 존재하지 않습니다.");
            }
        }


    }
    
    if (msg == "/체크") {
        // mj.json 값 읽어오기
        strTrial = DataBase.getDataBase(fileName);
        objTrial = JSON.parse(strTrial);

        let i,j = 0;
        let temp = "";
        let count = 0;
        for (i = 0; i < objTrial.length ; i++) {
            for (j = 0; j < objTrial[i].users.length; j++) {
                if (objTrial[i].users[j] == sender) {
                    count += 1;
                    temp += "\n\n방이름 : " + objTrial[i].name + "\n";
                    temp += "일　시 : " + objTrial[i].datetime + "\n";
                    temp += "연맹명 : " + objTrial[i].guildName;
                }
            }
        }
        replier.reply("[System]\n" + sender + "님의 참여 정보\n" +
            "---참여 중인 몬축 리스트(" + count + "개)---" +
            temp);
        count = 0;
    }

    // Help
    if (msg == "/?" || msg == "/help" || msg == "/도움말" || msg == "/h") {
        replier.reply(
            "[System]\n\n" + "===== 명령어 리스트 =====\n\n" +
            "----- 관리자를 포함한 모든 유저 -----\n" +
            "/참가,참여,지원 방이름\n -> 특정 몬축방 참여\n" +
            " ex)/참가 몬축\n ex)/참여 몬축\n ex)/지원 몬축\n\n" +
            "/불참 방이름\n -> 특정 방 불참(지원한 몬축방에서 내 이름 빼기)\n" +
            " ex)/불참 몬축\n\n" +
            "/목록\n -> 현재 진행 중인 모든 방 리스트 확인\n\n" +
            "/목록 방이름\n -> 특정 방의 참가자 리스트 확인\n ex)/목록 몬축\n\n" +
            "/체크\n -> 내가 참여하고 있는 모든 방 리스트 확인\n" +
            "\n\n" +
            "----- 관리자 전용 명령어 -----\n" +
            "/생성 방이름 일시 연맹명\n -> 방 생성\n" +
            " ex)/생성 몬축(방이름) 22시20분(일시) KRU(연맹명)\n\n" +
            "/수정,변경 방이름 바꿀방이름 바꿀일시 바꿀연맹명\n -> 방 수정" +
            " ex)/수정 몬축 5렙 22시 CRU\n\n" +
            "/제거,삭제 방이름\n -> 특정 방 제거\n" +
            " ex)/제거 몬축\n ex)/삭제 몬축\n\n" +
            "/초기화,리셋\n -> 모든 방 제거\n" +
            " ex)/초기화\n ex)/리셋\n\n" +
            "/마감 방이름\n -> 특정 방 참여제한\n" +
            " ex)/마감 몬축\n\n" +
            "/마감해제 방이름\n -> 특정 방 참여제한 해제\n" +
            " ex)/마감해제 몬축\n\n" +
            "/공지 방이름 내용\n -> 특정 방의 공지를 쓸 수 있음\n" +
            " ex)/공지 몬축(방이름) 오늘내용은 이것저것 이고 이런거 유의해주세요.(내용) (내용부분은 띄워쓰기 가능)\n" +
            "\n\n" +
            "도움말 : /? /help /도움말 /h\n\n제작자 : 로하스러브(LohaasLove)\n\n"+
            "Latest Update Date : 2019.08.29"
            );
    }

    // R4, R5
    if(msg.indexOf('/뽑기') != -1 || msg.indexOf('/랜덤') != -1) {
        // /뽑기,랜덤 최소 최대 개수
        let op = msg.trim().replace(/ +/g, " ").split(' ');
        let min = parseInt(op[1])
        let max = parseInt(op[2]);
        let count = parseInt(op[3]);
        let randomBox;
        let j = 0;

        let code = "랜덤뽑기 Code\n";
        code += "randomBox = new Array( max-min+1 );\n"+
        "let tmpMin = min;\n"+
        "for(let i = 0 ; i < max-min+1 ; i++){\n"+
        "   randomBox[i] = tmpMin;\n"+
        "   tmpMin += 1;\n"+
        "}\n"+
        "for (let i = randomBox.length - 1; i > 0; i--) {\n"+
        "   j = Math.floor(Math.random() * (i + 1));\n"+
        "   [randomBox[i], randomBox[j]] = [randomBox[j], randomBox[i]];\n"+
        "}\n"+
        "let result = randomBox.slice(0,count);\n";
        
        if(msg=="/뽑기 코드" || msg == "/랜덤 코드"){
            replier.reply(code);
        }
        else if(!isNaN(max) && !isNaN(count) && !isNaN(min)){
            if( (max-min+1) < count){
                replier.reply("[System]\n최대-최소값 보다, 뽑으려는 개수가 더 높습니다.\nex) 4~10사이 수 중 30개를 뽑으려고하면 오류");
            }
            else{
                replier.reply(
                    "[System]\n"+min + " ~ " + max + " 사이의 값 중 " + count + "개를 랜덤으로 뽑습니다...(중복x)\n"
                );
                randomBox = new Array( max-min+1 );
                let tmpMin = min;
                for(let i = 0 ; i < max-min+1 ; i++){
                    randomBox[i] = tmpMin;
                    tmpMin += 1;
                }
                for (let i = randomBox.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    [randomBox[i], randomBox[j]] = [randomBox[j], randomBox[i]];
                }
                let result = randomBox.slice(0,count);

                let re = "[System]\n---뽑기완료(총 "+ count +"명)---\n";
                for(let i = 0 ; i < result.length ; i++){
                    re += i+1;
                    re += ".  ";
                    re += result[i];
                    re += "번\n";
                }

                let d = new Date();
                let s =
                    leadingZeros(d.getFullYear(), 4) + '-' +
                    leadingZeros(d.getMonth() + 1, 2) + '-' +
                    leadingZeros(d.getDate(), 2) + ' ' +

                    leadingZeros(d.getHours(), 2) + ':' +
                    leadingZeros(d.getMinutes(), 2) + ':' +
                    leadingZeros(d.getSeconds(), 2);
              
                re += "\n생성시간 : "+s;
                re += "\n랜덤뽑기 Code는 /뽑기,랜덤 코드  명령어로 확인가능합니다."
                replier.reply(re);
            }
        }
        else{
            replier.reply("형식을 맞춰주세요.\n/뽑기,랜덤 최소 최대 개수.\n ex)/뽑기 16 80 6\n ex)/랜덤 5 30 12");
        }
        
    }

    if(msg.indexOf('/몬사') != -1 || msg.indexOf('/ㅁㅅ') != -1){
        let op = msg.trim().replace(/ +/g, " ").split(' ');
        let strMon = '';
        let objMon = [];
        let conMon = '';
        let fileMon = 'kruMon';
        let fileMonEtc = 'kruMonEtc';
        isExistUserName = false;
        
        /*
            * 연맹원 Table 구조 : ID, 이름, 인증 횟수, 최근 인증 날짜, 인증대상유무
                     -> person : id(number), name(string), times(string), rData(string-date), isToday(boolean), remark(string)
            /몬사 createTable : 테이블 생성 후, 정한 값으로 초기화
        */

        if(op[1] === 'createTable'){
            let tmp = [];
            conMon = JSON.stringify(tmp);
            DataBase.setDataBase(conMon,fileMon);

            let table = getInitMonTable();
            let i=0;
            for(i = 0 ; i<table.length; i++){
                strMon = DataBase.getDataBase(fileMon);
                objMon = JSON.parse(strMon);
                let nI = nextId();
                let info = {
                    "id" : nI,
                    "name" : table[i],
                    "times" : "0",
                    "rData" : "0000-00-00T00:00:00",
                    "isToday" : "x", 
                    "warning" : "0"
                };
                objMon.push(info);

                conMon = JSON.stringify(objMon);
                DataBase.setDataBase(conMon, fileMon);
                strMon = DataBase.getDataBase(fileMon);
                objMon = JSON.parse(strMon);
            }
            let dPoint = "15";
            let dUrl = "local";
            let dNotice = 
            '대상자는 오늘 자정까지 총 "'+
            dPoint+
            'p"를 인증합니다.\n'+
            '  (1레벨 = 1p, 2레벨 = 5p, 3레벨 = 15p)\n'+
            '1:1 인증 카톡방 : '+
            dUrl+
            '\n'+
            '연맹채팅창과 격파로그가 모두 나올 수 있게 캡쳐하여\n'+
            '위의 채팅방에 올려 주시면 감사하겠습니다.\n';
            let tmp2= {
                "notice":dNotice,
                "SEQ":"0",
                "url":dUrl,
                "point" : dPoint
            };
            let conMonEtc = JSON.stringify(tmp2);
            DataBase.setDataBase(conMonEtc,fileMonEtc);
            replier.reply("[System]\n"+"2019.09.01 오전8시 기준 테이블(맹원, 옵션) 초기화");
        }
        /*
            * 기능
            /몬사 공지 : 공지 출력
            /몬사 공지등록 내용 : 공지저장
            /몬사 링크등록 링크 : 몬사인증 링크 저장
            /몬사 포인트등록 포인트 : 몬사인증 포인트 저장
            /몬사 뽑기 number : 인증 횟수가 가장낮은 연맹원들의 집합에서, n명을 뽑아 오늘의 인증대상자들을 선택
                                -> 1명이 남아있으면 그날은 한명만 인증 하는 것으로
            /몬사 [오늘 | 누구] : 오늘 인증해야 할 연맹원들의 목록
            /몬사 인증 ID : 해당 ID의 몬사를 인증하고, 인증 횟수를 1 증가, 최근 인증 날짜를 해당 시점에 등록
            /몬사 인증 ID : 해당 ID의 몬사를 인증하고, 인증 횟수를 1 감소, 경고 1증가, 인증날짜 등록x
        */

        else if(op[1] === '공지'){
        // 공지 출력
        let strMonEtc = DataBase.getDataBase(fileMonEtc);
        let objMonEtc = JSON.parse(strMonEtc);
        replier.reply('[System]\n---몬사 인증 공지---\n\n'+
        objMonEtc.notice +
        '\n포인트 : '+objMonEtc.point +
        '\n인증방 : '+objMonEtc.url
        );
        }
        else if(op[1] === '공지등록'){
            let strMonEtc = DataBase.getDataBase(fileMonEtc);
            let objMonEtc = JSON.parse(strMonEtc);
            let j = 0;

            for (j = 0, len = op.length; j < len; j++) {
                op[j] = msg.indexOf(op[j]);
            }
            if (op.length < 3) {
                replier.reply("[System]\n몬사 공지가 너무짧습니다.");
            } else {
                let tempidx = op[2];
                let temp = msg.slice(tempidx);

                objMonEtc.notice = "\n" + temp + "\n";

                let result ="몬사 공지가 등록 되었습니다.\n내용:" + objMonEtc.notice.slice(0,
                    objMonEtc.notice.length / 2) + "...";

                replier.reply("[System] :" + result);

                conMonEtc = JSON.stringify(objMonEtc);
                DataBase.setDataBase(conMonEtc,fileMonEtc);
            }

            
        }
        else if(op[1] === '링크등록'){
            // 공지 출력
            let strMonEtc = DataBase.getDataBase(fileMonEtc);
            let objMonEtc = JSON.parse(strMonEtc);
            objMonEtc.url = op[2];
            conMonEtc = JSON.stringify(objMonEtc);
            DataBase.setDataBase(conMonEtc, fileMonEtc);

            strMonEtc = DataBase.getDataBase(fileMonEtc);
            objMonEtc = JSON.parse(strMonEtc);

            replier.reply("[System]\n링크등록 완료. 링크 : "+objMonEtc.url);
        }
        else if(op[1] === '포인트등록'){
            // 공지 출력
            let strMonEtc = DataBase.getDataBase(fileMonEtc);
            let objMonEtc = JSON.parse(strMonEtc);
            objMonEtc.point = op[2];
            conMonEtc = JSON.stringify(objMonEtc);
            DataBase.setDataBase(conMonEtc, fileMonEtc);

            strMonEtc = DataBase.getDataBase(fileMonEtc);
            objMonEtc = JSON.parse(strMonEtc);

            replier.reply("[System]\n포인트등록 완료. 포인트 : "+objMonEtc.point);
        }
        else if(op[1] === '뽑기'){
            let isOver = false;
            let strMonEtc = DataBase.getDataBase(fileMonEtc);
            let objMonEtc = JSON.parse(strMonEtc);
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);

            let count = parseInt(op[2]);
            let idx = parseInt(objMonEtc.SEQ);
            let i = 0;
            let re = "";
            if(!isNaN(count)){
                for(i = idx ; i < idx+count ; i++){
                    if(i > objMon.length-1){
                        isOver = true;
                        break;
                    }
                    else{
                        objMon[i].isToday = 'o';
                        re += '이름 : '+objMon[i].name + ' / ID : ' + objMon[i].id + '\n';
                        isOver = false;
                    }
                }
                if(isOver){
                    objMonEtc.SEQ = 0;
                }
                else{
                    let rSeq = idx + count;
                    objMonEtc.SEQ = rSeq;
                }

                conMon = JSON.stringify(objMon);
                DataBase.setDataBase(conMon, fileMon);
                strMon = DataBase.getDataBase(fileMon);
                objMon = JSON.parse(strMon);

                conMonEtc = JSON.stringify(objMonEtc);
                DataBase.setDataBase(conMonEtc, fileMonEtc);
                strMonEtc = DataBase.getDataBase(fileMonEtc);
                objMonEtc = JSON.parse(strMonEtc);
                replier.reply("[System]\n/몬사 뽑기 ("+count+"명)완료\n\n"+re);
            }
            else{
                replier.reply("[System]\n/몬사 뽑기 숫자 형식을 지켜주세요.")
            }
        }

        else if(op[1] === '오늘' || op[1] === '누구'){
            let strMonEtc = DataBase.getDataBase(fileMonEtc);
            let objMonEtc = JSON.parse(strMonEtc);
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);
            let count = 0;
            let result = '';
            for(let i = 0 ; i < objMon.length ; i++){
                if(objMon[i].isToday == 'o'){
                    result += objMon[i].name+"님(ID : "+objMon[i].id+")\n";
                    count += 1;
                }
            }
            replier.reply('[System]\n---오늘의 몬사인증 명단('+count+'명)---\n\n'+
            result+'\n오늘 자정 전 까지 인증 해 주시길 바랍니다.\n인증경로 : '+objMonEtc.url+'\n인증포인트 : '+objMonEtc.point);
        }
        else if(op[1] === '인증'){
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);
            let id = parseInt(op[2]);
            let i = 0;
            if(!isNaN(id) && id !== undefined && id !== '' && id !== ' ' && id !== null){
                for(i =0 ; i<objMon.length; i++){
                    if(parseInt(objMon[i].id) == id){
                        isExistUserName = true;
                        break;
                    }
                }
                if(isExistUserName && objMon[i].isToday == 'o'){
                    let d = new Date();
                    objMon[i].isToday = 'x';
                    objMon[i].times = parseInt(objMon[i].times)+1;
                    objMon[i].rData = d.toLocaleString('ko-KR');

                    conMon = JSON.stringify(objMon);
                    DataBase.setDataBase(conMon, fileMon);
                    strMon = DataBase.getDataBase(fileMon);
                    objMon = JSON.parse(strMon);

                    replier.reply('[System]\nID : '+ id+', 이름 : '+objMon[i].name+'님은 인증 되었습니다.');
                }
                else{
                    replier.reply('[System]\n몬사 테이블에 없는 ID이거나 대상이 아닙니다. 인증실패');
                }
            }
        }
        else if(op[1] === '미인증'){
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);
            let id = parseInt(op[2]);
            let i = 0;
            if(!isNaN(id) && id !== undefined && id !== '' && id !== ' ' && id !== null){
                for(i =0 ; i<objMon.length; i++){
                    if(parseInt(objMon[i].id) == id){
                        isExistUserName = true;
                        break;
                    }
                }
                if(isExistUserName && objMon[i].isToday == 'o'){
                    let d = new Date();
                    objMon[i].isToday = 'x';
                    objMon[i].times = parseInt(objMon[i].times)-1;
                    objMon[i].warning = parseInt(objMon[i].warning)+1;

                    conMon = JSON.stringify(objMon);
                    DataBase.setDataBase(conMon, fileMon);
                    strMon = DataBase.getDataBase(fileMon);
                    objMon = JSON.parse(strMon);

                    replier.reply('[System]\nID : '+ id+', 이름 : '+objMon[i].name+'님은 미인증 되었습니다.\n경고+1을 부과하였습니다.');
                }
                else{
                    replier.reply('[System]\n몬사 테이블에 없는 ID이거나 대상이 아닙니다. 미인증실패');
                }
            }
        }

        /*
            * 몬사 Table 관리 - Initialization ,Create, Read, Update, Delete
            /몬사 init : 몬사현황 테이블 초기화
            /몬사 추가,등록 이름 : 인증테이블에 연맹원 추가(ID 자동부여)
            /몬사 목록 option[ id,아이디 | 이름 | 횟수 | 날짜 | 경고 ] : 연맹원 전체 현황( ID / 이름 / 인증 횟수 / 최근 인증 날짜 / 경고)
                                                  -> 뒤에 옵션은 정렬기준
            /몬사 수정 ID 이름 바꿀이름: 연맹원 이름 수정
            /몬사 수정,변경 ID 경고 바꿀경고: 연맹원 이름 수정
            /몬사 삭제,제거 ID : 연맹원 정보 삭제
        */
        else if(op[1] === 'initialization'){
            let tmp = [];
            conMon = JSON.stringify(tmp);
            DataBase.setDataBase(conMon,fileMon);
    
            // mj.json 값 읽어오기
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);
    
            replier.reply('[System]\n몬사 테이블 초기화\n');
        }
        else if(op[1] === '추가' || op[1] === '등록'){
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);
            let tmpName = msg.slice(7,msg.length);
            if(op[2] !== undefined || op[2] !== ' ' || op[2] !== '' || op[2] !== null ){
                for(let i = 0 ; i<objMon.length ; i++){
                    if(objMon[i].name == op[2]){    
                        isExistUserName = true;
                    }
                }
                if(isExistUserName == false){
                    let nI = nextId();
                    let info = {
                        "id" : nI,
                        "name" : tmpName,
                        "times" : "0",
                        "rData" : "0000-00-00T00:00:00",
                        "isToday" : "x", 
                        "warning" : "0"
                    };
                    objMon.push(info);
    
                    conMon = JSON.stringify(objMon);
                    DataBase.setDataBase(conMon, fileMon);
                    strMon = DataBase.getDataBase(fileMon);
                    objMon = JSON.parse(strMon);

                    replier.reply("[System]\n"+tmpName+"님은 고유번호 "+ nI +"번으로 등록 되었습니다.");
                }
                else{
                    replier.reply("[System]\n이미 있는 이름입니다.");
                    isExistUserName = false;
                }
                isExistUserName = false;
            }
            else{
                replier.reply("[System]\n/몬사 추가 이름 형식을 맞춰주세요");
            }
            
        }
        else if(op[1] === '목록'){
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);
            let result = '';
            let target = [];
            
            if(op[2] === 'id' || op[2] === 'ID' || op[2] === '아이디' || op[2] === undefined || op[2] === null || op[2] === '' || op[2] === ' '){
                target = objMon.sort(function(a,b){return parseInt(a.id)-parseInt(b.id);});
                result = makeMonList(target, 'id');
                replier.reply(result);
            }
            else if(op[2] === '이름'){
                target = objMon.sort(function(a,b){return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;});
                result = makeMonList(target, '이름');
                replier.reply(result);
            }
            else if(op[2] === '횟수'){
                target = objMon.sort(function(a,b){return parseInt(a.times)-parseInt(b.times);});
                result = makeMonList(target, '횟수');
                replier.reply(result);
            }
            else if(op[2] === '날짜'){
                target = objMon.sort(function(a,b){return b.rData.localeCompare(a.rData);});
                result = makeMonList(target, '날짜');
                replier.reply(result);
            }
            else if(op[2] === '경고'){
                target = objMon.sort(function(a,b){return parseInt(b.warning)-parseInt(a.warning);});
                result = makeMonList(target, '경고');
                replier.reply(result);
            }
            else{
                replier.reply('[System]\n/몬사 목록 [옵션 - 기본값:id] 형식을 맞춰주세요.\noption : id, 이름, 횟수, 날짜, 경고')
            }
        }
        else if(op[1] === '수정' || op[1] === '변경'){
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);
            let id = parseInt(op[2]);
            let i, count= 0;
            let orgName = '';
            let orgwarn = '';

            if(!isNaN(id) && id !== undefined && id !== '' && id !== ' ' && id !== null){
                for(i =0 ; i<objMon.length; i++){
                    if(parseInt(objMon[i].id) === id){
                        isExistUserName = true;
                        break;
                    }
                }
                if(isExistUserName){
                    if(op[3] === '이름'){
                        if(op[4] !== undefined && op[4] !== null && op[4] !== '' && op[4] !== ' '){
                            for (let i = 0 ; i<objMon.length ; i++){
                                if(objMon[i].name === op[4]){
                                    count +=1;
                                }
                            }
                            replier.reply("count : "+ count);
                            if (count < 1){
                                orgName = objMon[i].name;
                                objMon[i].name = op[4];
                                let result = "ID : "+objMon[i].id + "님의 이름이 변경 되었습니다."+
                                "\n원본내용 : " + orgName;
                                result += "\n변경내용 : " + objMon[i].name;
    
                                conMon = JSON.stringify(objMon);
                                DataBase.setDataBase(conMon, fileMon);
                                strMon = DataBase.getDataBase(fileMon);
                                objMon = JSON.parse(strMon);
    
                                replier.reply('[System]\n'+result);
                                count = 0;
                            }
                            else {
                                replier.reply("[System]\n테이블에 이미 존재하는 이름 입니다.");
                                count = 0;
                            }
                        }
                        else{
                            replier.reply('[System]\n/몬사 수정 ID 이름 바꿀이름 형식을 맞춰주세요');
                        }
                    }
                    else if(op[3] === '경고' && op[4] !== undefined && op[4] !== null && op[4] !== '' && op[4] !== ' '){
                        orgwarn = objMon[i].warning;
                        objMon[i].warning = op[4];
                        let result = "ID : "+objMon[i].id + "님의 경고 횟수가 변경 되었습니다."+
                        "\n원본내용 : " + orgwarn+"회";
                        result += "\n변경내용 : " + objMon[i].warning+"회";

                        conMon = JSON.stringify(objMon);
                        DataBase.setDataBase(conMon, fileMon);
                        strMon = DataBase.getDataBase(fileMon);
                        objMon = JSON.parse(strMon);

                        replier.reply('[System]\n'+result);
                    }
                    else{
                        replier.reply('[System]\n/몬사 수정 ID 경고횟수 바꿀 경고횟수 형식을 맞춰주세요');
                    }
                }
                else{
                    replier.reply('[System]\n몬사 테이블에 없는 ID입니다.');
                }
            }
            else{
                replier.reply('[System]\n/몬사 수정 ID [옵션] 형식을 맞춰주세요.');
            }
        }
        else if(op[1] === '삭제' || op[1] === '제거'){
            strMon = DataBase.getDataBase(fileMon);
            objMon = JSON.parse(strMon);
            let id = parseInt(op[2]);
            let i = 0;

            if(!isNaN(id) && id !== undefined && id !== '' && id !== ' ' && id !== null){
                for(i =0 ; i<objMon.length; i++){
                    if(parseInt(objMon[i].id) == id){
                        isExistUserName = true;
                        break;
                    }
                }
                if(isExistUserName){
                    let idx = objMon.map(x => {
                        return x.id;
                    }).indexOf(objMon[i].id);
                    objMon.splice(idx, 1);

                    conMon = JSON.stringify(objMon);
                    DataBase.setDataBase(conMon, fileMon);
                    strMon = DataBase.getDataBase(fileMon);
                    objMon = JSON.parse(strMon);

                    replier.reply('[System]\nID : '+ id+'을(를)삭제 하였습니다.');
                }
                else{
                    replier.reply('[System]\n몬사 테이블에 없는 ID입니다. 삭제실패');
                }
            }
            else{
                replier.reply('[System]\n/몬사 삭제 ID 형식을 맞춰주세요.');
            }
        }
        else if(op[1] === '?' || op[1] === 'h' || op[1] === 'help' || op[1] === '도움말'){
            let result = 
            "[System]\n\n" + "=====몬사 명령어 리스트 =====\n\n"+
            "----- R4, R5만 가능. 관리자 필요시 말씀주세요 -----\n" +
            "\n\n----- 몬사 인원 뽑기, 인증, 공지관련 -----\n"+
            "/몬사,ㅁㅅ 공지\n -> 몬사 공지출력\n" +
            " ex)/몬사 공지\n\n" +
            "/몬사,ㅁㅅ 공지등록\n -> 몬사 공지등록\n" +
            " ex)/몬사 공지등록 내용\n\n" +
            "/몬사,ㅁㅅ 링크등록\n -> 몬사 인증링크등록\n" +
            " ex)/몬사 링크등록 http://abceg.co.kr\n\n" +
            "/몬사,ㅁㅅ 포인트등록\n -> 몬사 인증포인트등록\n" +
            " ex)/몬사 포인트등록 15\n\n" +
            "/몬사,ㅁㅅ 뽑기 인원수\n -> 몬사 인원 뽑기\n" +
            " ex)/몬사 뽑기 5\n\n" +
            "/몬사,ㅁㅅ [오늘 | 누구]\n -> 오늘의 몬사인원 출력\n" +
            " ex)/몬사 오늘\n ex)/몬사 누구\n\n" +
            "/몬사,ㅁㅅ 인증 id\n -> 몬사 완료 시 id로 인증. 인증 횟수를 1 증가, 일시등록o\n" +
            " ex)/몬사 인증 46\n\n" +
            "/몬사,ㅁㅅ 미인증 id\n -> 몬사 완료 시 id로 미인증. 인증 횟수를 1 감소, 경고 1증가, 일시등록x\n" +
            " ex)/몬사 미인증 47\n\n" +
            "\n\n----- 연맹원 리스트 관리 -----\n"+
            "/몬사,ㅁㅅ 추가,등록 이름\n -> 몬사 테이블에 연맹원 추가\n" +
            " ex)/몬사 추가 KRU Say\n ex)/ㅁㅅ 등록 LohaasLove\n\n" +
            "/몬사,ㅁㅅ 목록 [옵션(필요시-정렬기준)]\n -> option : id,아이디 / 이름 / 횟수 / 날짜 / 경고\n" +
            " ex)/몬사 목록\n ex)/ㅁㅅ 목록 이름\n ex)/ㅁㅅ 목록 경고\n\n" +
            "/몬사,ㅁㅅ 수정 id 이름 바꿀이름\n -> 연맹원의 id로 이름 변경\n" +
            " ex)/몬사 수정 3 이름 KRUSAY\n ex)/ㅁㅅ 수정 6 이름 LOHAAS\n\n" +
            "/몬사,ㅁㅅ 수정 경고 바꿀경고횟수\n -> 연맹원의 id로 경고횟수 변경\n" +
            " ex)/몬사 수정 3 경고 2\n ex)/ㅁㅅ 수정 6 경고 1\n\n" +
            "/몬사,ㅁㅅ 삭제 id\n -> 연맹원의 id로 해당 연맹원 삭제\n" +
            " ex)/몬사 삭제 3\n ex)/ㅁㅅ 삭제 8\n\n" +
            "제작자 : 로하스러브(LohaasLove)\n\n"+
            "Latest Update Date : 2019.09.01";
            replier.reply(result);
        }
        else{
            replier.reply("[System]\n몬사 명령어를 확인 하세요\n/몬사 ?\n/몬사 h\n/몬사 help\n/몬사 도움말");
        }
    }   
}

//이 아래 6가지 메소드는 스크립트 액티비티에서 사용하는 메소드들
function onCreate(savedInstanceState, activity) {}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}

function onDestroy(activity) {}

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
}
  
function nextId(){
    let fileMon = 'kruMon'
    let strMon = DataBase.getDataBase(fileMon);
    let objMon = JSON.parse(strMon);
    let max = 0;
    let search = 0;

    for(let i = 0 ; i < objMon.length ; i++){
        search = parseInt(objMon[i].id);
        if( max < search){
            max = search;
        }
    }
    return max+1;
}

function makeMonList(objArray, option){
    let maxName = 0;
    for(let i = 0 ; i<objArray.length; i++){
        if( maxName < objArray[i].name.length){
            maxName = objArray[i].name.length;
        }
    }
    let result = '[System]\n---몬사 전체 목록';
    if(option == 'id' || option == 'ID' || option == '아이디'){
        result += '(ID기준 정렬. 총'+ objArray.length +'명)---\n\n';
    }
    else if(option == '이름'){
        result += '(이름기준 정렬. 총'+ objArray.length +'명)---\n\n';
    }
    else if(option == '횟수'){
        result += '(횟수기준 정렬. 총'+ objArray.length +'명)---\n\n';
    }
    else if(option == '날짜'){
        result += '(날짜기준 정렬. 총'+ objArray.length +'명)---\n\n';
    }
    else if(option == '경고'){
        result += '(경고기준 정렬. 총'+ objArray.length +'명)---\n\n';
    }
    else{
        result += '(총'+ objArray.length +'명)---\n\n';
    }
    result+= 'ID |       이름       |인증횟수|        인증 날짜         |대상자| 경고횟수\n';
    for(let i = 0 ; i < objArray.length; i++){
        let tmpId = String(objArray[i].id);
        let tmpName = String(objArray[i].name);
        result += tmpId.padEnd(3,' ') + '| ' +  tmpName.padEnd(maxName+2, ' ') + '| ' + 
        objArray[i].times + ' | ' +objArray[i].rData + ' | ' +objArray[i].isToday + ' | ' +
        objArray[i].warning+ '\n'
    }
    return result;
}

function getInitMonTable(){
    let table = new Array(
        'KRU Say', 'LohaasLove', 'HaLind', 'G O L D BAR',
        'Julie11', 'B o m m', 'sunlover212', 'TWICE', 'M A R S',
        'P O O H', 'CarriesNote', 'Koreart', 'jm82', 'KOR siki01',
        'onetoo12', 'K ONE Life', 'Like bluse', 'Allre', '567777456',
        'johyoun', 'MAN DOO', 'KTS king', 'KR HellLion', 'Wons dive',
        'ASTER81', 'KRU JAMONG', 'Naver PaPaGo', 'KRU chh',
        'Marine H', 'Kahawa', 'choiys', 'KRU SOREN', 'Sarangsp', 'Devil Dalbae',
        'ADOY Dalbae', 'GiantWorm', 'Ramang', 'Sou Kenzo', 'Choco c',
        'Rodeuni', 'DRAGON627', 'chochoi', 'Chekitah', 'akakill Soul',
        'sube85', 'chilchilchil', 'koohe', 'So weak tex', 'pshnj',
        'Sensation2', 'liteshow', 'HEBESh', 'thoumaman', 'iiilili', 'HideOnC',
        'startminstark', '4849', 'PHANTOMxBH', 'NMPC', 'junnyp00', 'sun212',
        'Lee1224', 'Birds of War', 'Lohaas', 'en H', 'G a E u l l', 'ColaCider',
        'Hoddi Kim', 'KRU tuna', 'la bonita', 'Lord Han', 'MadKitty', 'Oo SUMMER oO',
        'Oo WINTER oO', 'stone castle','joke26'
    );
    return table;
}

if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
}

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}