const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp =require('express-graphql')
const mongoose = require('mongoose')

const graphQLSchema = require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth')

const app = express();

app.use(bodyParser.json());

app.use(isAuth)

app.use('/graphql', graphqlHttp({
    schema:graphQLSchema,
    rootValue: graphQlResolver,
    graphiql:true

}));

console.log(`${process.env.DB_OPTIONS}`)
mongoose.connect(`mongodb://${process.env.DB_URL}/${process.env.MONGO_DB}`, {useNewUrlParser:true}).then(() => {
    app.listen(3000);
}).catch((err) => {
    console.log(err) 
})
