import dotenv from 'dotenv';
dotenv.config();

export default {
    token: process.env.TOKEN,
    dschannel: process.env.DSCHANNEL || "882103594319495189",
    codeRole: process.env.CODEROLE || '1216652644991504394',
    formRole: process.env.FORMROLE || '1216658653415739493'
};