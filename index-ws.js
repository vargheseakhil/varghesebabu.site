const express = require('express');
const server = require('http').createServer()

const app =  express()

app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname})
})

server.on('request', app);
server.listen(3000, function(){ console.log('Listening on 3000')})

process.on('SIGINT', () => {
    console.log('sigin')
    wss.clients.forEach(function each(client){
        client.close()
    })
    server.close(() => {
        shutDownDB();
    });
});

/** WebSocket begins */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server});

wss.on('connection', function connection(ws){
    const numOfClients = wss.clients.size;
    console.log('Clients connected', numOfClients);
     
    wss.broadcast(`Current visitors ${numOfClients}`);

    if(ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server');
    }

    db.run(`
        INSERT INTO visitors (count,time)
        VALUES (${numOfClients}, datetime('now'))
    `)

    ws.on('close', function close(){
        wss.broadcast(`Current visitors ${numOfClients}`);
        console.log('A client has disconnected')
    })
})

wss.broadcast = function broadcast(data){

    wss.clients.forEach(function each(client){
        client.send(data)
    })
}
/** End of WebSocket */

/** DB begins */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:') // Saves in memory (gone after restart)

// serialize check the existence of tables before running the commands
db.serialize(() => {
        db.run(`
        CREATE TABLE visitors (
                count INTEGER,
                time TEXT
        )
        `)
})

function getCounts() {
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row)
    })
}

function shutDownDB(){
    getCounts()
    console.log('Shutting down DB')
    db.close()
}
/** End of DB */