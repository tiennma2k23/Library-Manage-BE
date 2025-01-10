const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const AccountModel = require("../models/Account");

let checkAccountEmail = (accountEmail) => {
    console.log(accountEmail);
    return new Promise(async (resolve, reject) => {
        try {
            let account = await AccountModel.findOne({ Email: accountEmail });

            console.log(account);

            if (account) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const sendConfirmationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.GMAIL_APP_PASSWORD, 
        },
    });

    const url = "http://localhost:3000/confirm";
    await transporter.sendMail({
        to: email,
        subject: "Xác nhận tài khoản của bạn",
        html: `<h3>Nhấn vào liên kết bên dưới để xác nhận tài khoản của bạn:</h3>
               <a href="${url}">Xác nhận tài khoản</a>`,
    });
};

exports.handleUserSignup = async (name, email, password) => {
    try {
        let accountData = {};

        let isExist = await AccountModel.findOne({ Email: email });
        if (isExist) {
            accountData.errCode = 1;
            accountData.errMessage = "Email đã tồn tại. Hãy thử email khác.";
            return accountData;
        }

        let maxAccount = await AccountModel.findOne().sort({ AccountID: -1 }).exec();
        let newAccountID = maxAccount ? maxAccount.AccountID + 1 : 1;
        let hashedPassword = await bcrypt.hash(password, 10);

        let newAccount = await AccountModel.create({
            AccountID: newAccountID,
            Email: email,
            Name: name,
            Password: hashedPassword,
            Role: "user",
            State: "Request",
        });

        const token = jwt.sign(
            { userId: newAccount._id, email: newAccount.Email },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        await sendConfirmationEmail(email, token);

        accountData.errCode = 0;
        accountData.errMessage = "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.";
        accountData.account = newAccount;

        return accountData;

    } catch (e) {
        console.error(e);
        return {
            errCode: 2,
            errMessage: "Lỗi server, vui lòng thử lại sau!",
        };
    }
};

exports.handleUserLogin = async(email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accountData = {};

            let isExist = await checkAccountEmail(email);
            if (isExist) {
                let account = await AccountModel.findOne(
                    { Email: email },  // Điều kiện tìm kiếm
                    { _id: 1, Email: 1, Name: 1, Password: 1, Role: 1 }  // Các trường bạn muốn lấy
                );                

                if (account) {
                    let check = await bcrypt.compare(password, account.Password);
                    if (check) {
                        accountData.errCode = 0;
                        accountData.errMessage = 'Ok';

                        accountData.account = account;
                    } else {
                        accountData.errCode = 3;
                        accountData.errMessage = 'Sai mật khẩu';
                    }
                } else {
                    accountData.errCode = 2;
                    accountData.errMessage = `Người dùng không hợp lệ`;
                }
            } else {
                accountData.errCode = 1;
                accountData.errMessage = `Email không tồn tại. Hãy thử email khác`;
            }

            resolve(accountData);
        } catch (e) {
            reject(e);
        }
    });
}

exports.getAllUserSV = async() => {
    return AccountModel.find({Role: 'user'});
}

exports.getAUserSV = async(id) => {
    return await AccountModel.findOne({ _id: id });
}
