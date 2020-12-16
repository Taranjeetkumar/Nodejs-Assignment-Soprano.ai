const nodemailer = require('nodemailer');

exports.sendMail = async function (email, message, res) {
    try {

        // email connection
        const transporter =await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tjeet769@gmail.com',
                pass: 'Taran@123'
            }
        });

        const mailOption = {
            from: 'tjeet769@gmail.com', // sender this is your email here
            to: email, // receiver email2
            subject: "Account Verification",
            html: message,
        }

       const data =await transporter.sendMail(mailOption, async (err, info) => {
            if (err) {
                throw new Error(err.message);
            }
           
        })
        console.log(data);
        return data;
    }
    catch (error) {
        res.end(error.message);
    }
}
