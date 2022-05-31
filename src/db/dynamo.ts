import AWS from 'aws-sdk'

AWS.config.update({
    region: 'us-east-1',
})

const DynamoDB = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient()

export { docClient }
export default DynamoDB
