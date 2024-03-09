import express from "express";
import {conn, mysql} from "../dbcon";
export const router = express.Router();

router.get("/yesterday", (req, res) => {
    conn.query(`
        SELECT  
            images.*,
            RANK() OVER (ORDER BY SUM(vote.score) DESC) AS rankingyesterday
        FROM 
            images,vote
        WHERE  
            images.imgid = vote.imgid
        AND
            DATE(vote.vateDate) = CURDATE() - INTERVAL 1 DAY
        GROUP BY 
            images.imgid, images.imgurl, images.name, images.score, images.uid
        ORDER BY 
            images.score DESC
        LIMIT 0, 10 `, (err, result, fields)=>{
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

  router.get("/today", (req, res) => {
    conn.query(`
        SELECT  
            images.*,
            RANK() OVER (ORDER BY SUM(vote.score) DESC) AS rankingtoday
        FROM 
            images,vote
        WHERE  
            images.imgid = vote.imgid
        GROUP BY 
            images.imgid, images.imgurl, images.name, images.score, images.uid
        ORDER BY 
            images.score DESC
        LIMIT 0, 10 `, (err, result, fields)=>{
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