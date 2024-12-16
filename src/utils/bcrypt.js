import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    return bcrypt.hash(password.toString(), 10);
};

const validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

export {hashPassword, validatePassword};
