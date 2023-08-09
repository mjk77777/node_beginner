var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
// const comments = []; -> 휘발성 변수 db (fake)
// connecting to db (sqlite 와 연결하는 sequelize)
const sequelize = new Sequelize({
    dialect: 'sqlite', // DB 종류
    storage: 'database.sqlite'  //DB 파일 경로 지정 | 바로 파일 이름만 적어서 같은 폴더에 생성됨
  });

const Comments = sequelize.define('Comments', {
  // Comments라는 모델을 정의. + content 라는 컬럼 생성
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

(async () => {
    await Comments.sync();  // Comments 모델이 DB 와의 동기화를 기다림
    console.log("The table for the Comments model was just (re)created!"); // 동기화 작업이 완료되면 실행
})();



app.use(express.json()) //application/json의 Content-Type에 대해 파싱해주는 역할
app.use(express.urlencoded({extended : true })) //application/x-www-form-urlencoded의 Content-Type에 대해 파싱해주는 역할


// 'ejs'라는 view engine 을 사용할 거다
// ejs(html) 파일을 따로 만들어서, 응답에 실어서 보낼 거임
app.set('view engine', 'ejs');


// index page
app.get('/', async function(req, res) {  // 주소창으로 루트에 접근하면,

    // Find all comments
    const comments = await Comments.findAll();

    // console.log(comments)


    res.render('index', {comments : comments})  // view 폴더 밑 index.ejs 에서 받음.
});



// POST 요청 받음
app.post('/create', async function(req, res) {  
    

    const {content} = req.body  // content 값이 바로 들어감

    // db에 INSERT
    await Comments.create({ content : content });  // orm 방식 (sql 구문 쓰지 않고 insert 가능 )
    
    
    res.redirect('/')  // 어떤 경로로 이동시킨다. 다시 index 페이지로 
});


// POST 요청 받음
app.post('/update/:id', async function(req, res) {  
    console.log(req.params)
    console.log(req.body)  //body 에 담겨옴

    const {content} = req.body  // content 값이 바로 들어감
    const {id} = req.params //url 로 들어온 파라미터 값이 들어감

    
    await Comments.update({ content: content }, {
    where: {
      id: id
    }

  });
    
    res.redirect('/') 
});

// POST 요청 받음
app.post('/delete/:id', async function(req, res) {  
    console.log(req.params)

    const {id} = req.params //url 로 들어온 파라미터 값이 들어감
    
    await Comments.destroy({
    where: {
      id: id
    }
  });
    
    res.redirect('/') 
});

// GET 요청 받음
app.get('/create', function(req, res) {  
    console.log(req.query)
    res.send('hi')
});



app.listen(3000);
console.log('Server is listening on port 3000');