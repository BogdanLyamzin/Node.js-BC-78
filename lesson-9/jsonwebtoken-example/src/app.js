import jwt from "jsonwebtoken";
import "dotenv/config";

const {JWT_SECRET} = process.env;

const payload = {
    id: "69b983935d837e307c3d6fba",
    email: "jotay59477@soco7.com"
};

const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});
// console.log(token);
const decodeToken = jwt.decode(token);
// console.log(decodeToken);
try {
    const {id, email} = jwt.verify(token, JWT_SECRET);
    console.log({id, email});
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Yjk4MzkzNWQ4MzdlMzA3YzNkNmZiYSIsImVtYWlsIjoiam90YXk1OTQ3N0Bzb2NvNy5jb20iLCJpYXQiOjE3NzM3NjYwNjIsImV4cCI6MTc3Mzg1MjQ2Mn0.aywGdMfy_UIDTAAbZn6FZaT9-qa_XsGTVVX3Ew3I0AG";
    jwt.verify(invalidToken, JWT_SECRET);
}
catch(error) {
    console.log(error.message);
}