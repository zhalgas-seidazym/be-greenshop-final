import bcrypt from 'bcrypt';

const hashPassword = (password) => {
    return bcrypt.hash(password.toString(), 10);
};

const validatePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

export {hashPassword, validatePassword};
