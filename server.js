const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb+srv://leesu0229:dldudwls5!@cluster0.h04vcor.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
    if(err) return console.log(err)

    db = client.db('todoapp');

    app.listen(8080, function(){
        console.log('listening on 8080');
    });
})

app.get('/beauty', (req, res) => {
    res.send('beauty 용품 쇼핑 사이트');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/write.html');
});

app.post('/add', (req, res) => {
    res.send('전송완료');
    db.collection('counter').findOne({name : "게시물 갯수"}, (err, result) => {
        console.log(result.totalPost);
        let totalPost = result.totalPost;
        db.collection('post').insertOne({_id: totalPost + 1, title: req.body.title, date: req.body.date}, (err, res) => {
            console.log('저장완료');
            // counter에 있는 총 게시물 갯수 업데이트 함. 첫번째 인자는 어떤 데이터를 수정할 지, 두번째 인자는 수정값(어떻게 수정하겠습니다.)
            // set은 아예 바꿔주세요. inc는 기존값에 더해줄 값
            db.collection('counter').updateOne({name: "게시물 갯수"}, { $inc : {totalPost: 1}}, (err, result) => {
                if(err) return console.log(err);
            });

            });
        });
    });

app.get('/list', (req, res) => {
    db.collection('post').find().toArray((err, result)=>{
        console.log(result);
        res.render('list.ejs', { posts: result });
    });
    
});