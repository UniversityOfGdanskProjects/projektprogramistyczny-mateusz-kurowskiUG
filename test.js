import bcrypt from 'bcrypt'
const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)
console.log(salt);
const password = '123456'
const hash = bcrypt.hashSync(password, salt)
console.log(hash);

bcrypt.compare('1234', hash, (err, res) => {
    console.log(res);
})