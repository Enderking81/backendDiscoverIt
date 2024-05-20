const express = require('express')
const app = express()

const modelComment = require('./models').Comment
const modelPlaceProduct = require('./models').Place_Product
const modelRecommendation = require('./models').Recommendation
const modelUser = require('./models').User

app.use(express.urlencoded({extended:true}))
app.use(express.json())

// Alta
app.post('/createUser', (req,res) => {
  modelUser.create(req.body)
    .then( (data) => {
      res.json( { data: data} )
    } )
    .catch( (error) => {
      res.json( { error: error})
    } )
})

app.listen(3000, () => {
  console.log('App listening at port 3000')
})