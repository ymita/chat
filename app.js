// 参考ページ
// http://www.websuppli.com/nodejs/443/

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const messages = [
    {
        id: 0,
        user: 'admin',
        text: 'チャットルームへようこそ'
    }
];
const rooms = [];
let room = null;

app.get('/', (req, res) => {
    // クライアントの画面表示用に chat.html を送信
    // res.sendFile(__dirname + '/chat.html');
    res.sendFile(__dirname + '/index.html');

    // setTimeout(() => {
    //     let rFound;
    //     let roomInit = {
    //         'roomName': room,
    //         'messages': [
    //             {
    //                 id: 0,
    //                 user: 'admin',
    //                 text: 'チャットルームへようこそ'
    //             }
    //         ]
    //     };
    //     retMessages = roomInit.messages;
    //     // 部屋がなければ、部屋をメモリ上に保存(部屋のメッセージを保存するため)
    //     if (rooms.length === 0) {
    //         rooms.push(roomInit);
    //     } else {
    //         rFound = rooms.find(r => {
    //             return r.roomName === room;
    //         });
    //         if(rFound){
    //             retMessages = rFound.messages;
    //         }
    //         else if (!rFound) {
    //             rooms.push(roomInit);
    //         }
    //     }
    //     // TODO: 初回表示時に部屋のチャット履歴を送信する。
    //     io.to(room).emit('init', retMessages);
    // }, 1000);
});

app.get('/*', (req, res) => {
    // クライアントの画面表示用に chat.html を送信
    res.sendFile(__dirname + '/chat.html');

    // setTimeout(() => {
    //     let rFound;
    //     let roomInit = {
    //         'roomName': room,
    //         'messages': [
    //             {
    //                 id: 0,
    //                 user: 'admin',
    //                 text: 'チャットルームへようこそ'
    //             }
    //         ]
    //     };
    //     retMessages = roomInit.messages;
    //     // 部屋がなければ、部屋をメモリ上に保存(部屋のメッセージを保存するため)
    //     if (rooms.length === 0) {
    //         rooms.push(roomInit);
    //     } else {
    //         rFound = rooms.find(r => {
    //             return r.roomName === room;
    //         });
    //         if (rFound) {
    //             retMessages = rFound.messages;
    //         }
    //         else if (!rFound) {
    //             rooms.push(roomInit);
    //         }
    //     }
    //     // TODO: 初回表示時に部屋のチャット履歴を送信する。
    //     io.to(room).emit('init', retMessages);
    // }, 1000);
});
// init でメッセージを受信したらクライアント全体にキャスト
io.on('connection', (socket) => {

    room = socket.request.headers.referer.split('/')[3];
    let r = room;
    socket.join(room, () => {
        //部屋ごとのメッセージ一覧を生成
        console.log('');
    });//url の末尾から部屋を決める。
    // 個別のメッセージ送信時
    socket.on('res', (msg) => {
        // const lastMessage = messages[messages.length - 1];
        // const user = msg.user;
        // const text = msg.text;
        // const obj = { id: lastMessage.id + 1, user: user, text: text };
        // messages.push(obj);


        // 送信されたメッセージを、対応する部屋の中に保存
        let room = rooms.find(r => {
            return r.roomName == msg.room
        });
        room.messages.push(msg);


        // 送信されたメッセージ(単体)を部屋にいるクライアントに送信
        io.to(msg.room).emit('res', msg);
    });
    socket.on('init', (msg) => {
        console.log(msg);
        let rFound;
        let roomInit = {
            'roomName': room,
            'messages': [
                {
                    id: 0,
                    user: 'admin',
                    text: 'チャットルームへようこそ'
                }
            ]
        };
        retMessages = roomInit.messages;
        // 部屋がなければ、部屋をメモリ上に保存(部屋のメッセージを保存するため)
        if (rooms.length === 0) {
            rooms.push(roomInit);
        } else {
            rFound = rooms.find(r => {
                return r.roomName === room;
            });
            if (rFound) {
                retMessages = rFound.messages;
            }
            else if (!rFound) {
                rooms.push(roomInit);
            }
        }
        // TODO: 初回表示時に部屋のチャット履歴を送信する。
        io.to(room).emit('init', retMessages);
    });
});

server.on('listening', () => {
    console.log('listening on 3000');
});

server.listen(3000);