import {config} from 'dotenv'
config({path: '.env'})

const mongo_URL= process.env.MONGO_URL
const port= process.env.PORT

export default {
    mongo_URL,
    port
}


