import express from "express";
import { conn, mysql } from "../dbcon";
import { VoteItem } from "../model/rank_get";
export const router = express.Router();

router.get("/yesterday", (req, res) => {
  conn.query(
    `
    SELECT  
        images.*,
        RANK() OVER (ORDER BY SUM(vote.score) DESC) AS rankingyesterday
    FROM 
        images,vote
    WHERE  
        images.imgid = vote.imgid
    AND 
        DATE(vateDate) < CURDATE()
    GROUP BY 
        images.imgid, images.imgurl, images.name, images.score, images.uid
    ORDER BY 
        images.score DESC
    LIMIT 0, 10 `,
    (err, result, fields) => {
      if (result && result.length > 0) {
        // ส่ง response กลับด้วยข้อมูลผู้ใช้
        res.json(result);
      } else {
        // ถ้าไม่พบผู้ใช้, ส่ง response กลับเป็น { success: false }
        res.json({
          success: false,
        });
      }
    }
  );
});

router.get("/today", (req, res) => {
  conn.query(
    `
        SELECT  
        images.*,
        ROW_NUMBER() OVER (ORDER BY SUM(vote.score) DESC) AS rankingtoday
    FROM 
        images
    INNER JOIN 
        vote ON images.imgid = vote.imgid
    GROUP BY 
        images.imgid, images.imgurl, images.name, images.score, images.uid
    LIMIT 0, 10; `,
    (err, result, fields) => {
      if (result && result.length > 0) {
        // ส่ง response กลับด้วยข้อมูลผู้ใช้
        res.json(result);
      } else {
        // ถ้าไม่พบผู้ใช้, ส่ง response กลับเป็น { success: false }
        res.json({
          success: false,
        });
      }
    }
  );
});

router.get("/graph/:uid", (req, res) => {
  let uid = +req.params.uid;
  const sql = `
  SELECT 
  GROUP_CONCAT(voteDate ORDER BY voteDate ASC) AS voteDate,
  GROUP_CONCAT(totalScore ORDER BY voteDate ASC) AS totalScore,
  imgid,
  name,
  imgurl
  FROM (
      SELECT 
      DATE(vateDate) AS voteDate,
      500 + SUM(vote.score) AS totalScore,
      vote.imgid,
      images.name,
      images.imgurl
      FROM vote,images
      WHERE vote.imgid = images.imgid
         AND DATE(vateDate) >= CURDATE() - INTERVAL 7 DAY
      AND userid = ?
      GROUP BY DATE(vateDate), vote.imgid
      ) AS subquery
      GROUP BY imgid
      ORDER BY imgid, MAX(voteDate) ASC
    `;
  conn.query(sql, [uid], (err, result, fields) => {
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
