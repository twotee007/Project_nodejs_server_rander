import express from "express";
import {conn, mysql} from "../dbcon";
import { SignUpGet } from "../model/login_get";
export const router = express.Router();


router.get("/", (req, res) => {
    conn.query('select * from user', (err, result, fields)=>{
        if (result && result.length > 0) {
            // ส่ง response กลับด้วยข้อมูลผู้ใช้
            res.json(result);
        } else {
            // ถ้าไม่พบผู้ใช้, ส่ง response กลับเป็น { success: false }
            res.json({
                success: false,
            });
        }
    });
  });

  router.get("/:uid", (req, res) => {
    let uid = req.params.uid;
    const sql ="SELECT * FROM user WHERE uid = ?";
    conn.query(sql, [uid], (err, result, fields) => {
            // ตรวจสอบว่ามีผลลัพธ์หรือไม่
            if (result && result.length > 0) {
                // ส่ง response กลับด้วยข้อมูลผู้ใช้
                res.json(result);
            } else {
                // ถ้าไม่พบผู้ใช้, ส่ง response กลับเป็น { success: false }
                res.json({
                    success: false,
                });
            }
    });
});

router.get("/:username/:password", (req, res) => {
    let username = req.params.username;
    let password = req.params.password;
    const sql ="SELECT * FROM user WHERE username = ? AND password = ?";
    conn.query(sql, [username, password], (err, result, fields) => {
            // ตรวจสอบว่ามีผลลัพธ์หรือไม่
            if (result && result.length > 0) {
                // ส่ง response กลับด้วยข้อมูลผู้ใช้
                res.json(result);
            } else {
                // ถ้าไม่พบผู้ใช้, ส่ง response กลับเป็น { success: false }
                res.json({
                    success: false,
                });
            }
    });
});

router.post("/signup",(req,res)=>{
    let signup : SignUpGet = req.body;
    let sql = "INSERT INTO `user`(`username`, `name`,`password`,`type`) VALUES (?,?,?,?)";
    sql = mysql.format(sql,[
        signup.username,
        signup.name,
        // signup.image,
        signup.password,
        signup.type,
    ]);
    conn.query(sql,(err,result)=>{
        if(err)throw err;
        res.status(201).json({affected_row: result.affectedRows });
    });
});