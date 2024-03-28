import express from "express";
import {conn, mysql, queryAsync} from "../dbcon";
import { UpDateImg } from "../model/updateimg";
export const router = express.Router();

router.get("/", (req, res) => {
    conn.query(`select images.imgid,images.imgurl,images.name as nameimg,images.score,images.uid,user.name as nameuser
                from images,user
                WHERE images.uid = user.uid`,
        (err, result, fields)=>{
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

  router.put("/update/:imgid", async(req,res)=>{
    //1. Receive data from requrst
    const imgid = +req.params.imgid;
    let updateimg : UpDateImg = req.body;

      let   sql = "update  `images` set `score`=? where `imgid`=?";
        sql = mysql.format(sql , [
            updateimg.score,
            imgid
        ]);
        //5.Send Query for updata
        conn.query(sql,(err,result)=>{
            if(err)throw err;
            res.status(200).json({
                affected_row : result.affectedRows
            });
        });
});
