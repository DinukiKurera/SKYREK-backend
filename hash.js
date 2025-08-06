import bcrypt from 'bcrypt';

const plainPassword = "123456";

bcrypt.hash(plainPassword, 10).then(hash => {
  console.log("Hashed Password:", hash);
});
