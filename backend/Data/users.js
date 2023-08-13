import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin  User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Erling Haaland",
    email: "erling@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: " Jonny Stones",
    email: "jonny@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];
export default users;
