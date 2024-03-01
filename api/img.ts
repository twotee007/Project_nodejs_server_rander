import express from "express";
import {conn, mysql} from "../dbcon";
export const router = express.Router();

router.get("/", (req, res) => {
    conn.query('select imgid,imgurl,score from images', (err, result, fields)=>{
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