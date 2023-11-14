const express = require("express");
const cors = require("cors");
const apiRoutes = require('./routes/api.js');
const errorHandler = require('./middlewares/errorHandler');
const { PORT} = require('./config/env');
const { updateTime } = require('./services/timerService');

const app = express();

// Middleware setup
app.use(cors({
  origin:["http://localhost:3000","https://final-project-online-v4.onrender.com","https://online-lagw.netlify.app","https://sixdraw.in","http://sixdraw.in"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/api/getKey',(req, res)=>{
  res.status(200).json({key: process.env.RAZORPAY_KEY_ID})
} )

const sendEmail = require('./sendEmail/sendEmail.js');

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  let mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text
  };

  try {
    const result = await sendEmail(mailOptions);
    res.status(result.status).send({ message: result.message });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'An error occurred while sending the email' });
  }
});


// Central error handler
app.use(errorHandler);

setInterval(updateTime, 1000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
