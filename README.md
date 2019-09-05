# Food Auth Api

### Installation Guide
Download or clone project.  
Run `npm install`.  
Create an `.env` file. Copy variables from `.env.default` to your `.env` file.  
Create an account at SendGrid, or Ethereal for testing and development, and fill in the related environment variables.
Create a test and development database and have them running in a separate window.  
Add a code to `ADMIN_CODE` and a time in millisecond to `JWT_EXPIRATION_TIME`.  
Run `npm run api-dev` for development.

### Environment Variables
`NODE_ENV` is set to `development` or `production`.  
`PORT` is set to whatever port you want.  
`HOST` is set to the host url for the postgresql DB. For development I used `localhost`.  
`DB` is the name of your postgresql DB. 
`DB_TEST` is the name of your test DB.   
`DB_PORT` is the port number of your postgresql DB.  
`DB_USER` is the username for your postgresql DB.  
`DB_PW` is the password of your postgresql DB.  
`JWT_SECRET` is the secret for the json web token.  
`SG_API_KEY` is the api key for SendGrid.  
`URL` is the url where your api is hosted.  
`EMAIL` is the email address of where you send the emails from.  
`EMAIL_HOST` SendGrid or Ethereal host.  
`EMAIL_USER` SendGrid or Ethereal username.  
`EMAIL_PW` SendGrid or Etherial password.  
`EMAIL_PORT` email port.  
`ADMIN_CODE` is the code to give to users to add to the signup process to become admins.  
`JWT_EXPIRATION_TIME` set time in milliseconds.  

### Running tests
Run `npm run test` to execute tests.  