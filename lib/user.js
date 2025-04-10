import db from './db';
export  function createUser(email,password) {
   const result= db.prepare("INSERT INTO users (email,password) VALUES (?,?)")
    .run(email,password);
    // return db.prepare("SELECT id FROM users WHERE email = ?").get(email);
   return result.lastInsertRowid
} 