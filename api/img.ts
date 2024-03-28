import express from "express";
import {conn, mysql, queryAsync} from "../dbcon";
import { UpDateImg } from "../model/updateimg";
export const router = express.Router();

router.get("/", (req, res) => {
    conn.query('select * from images', (err, result, fields)=>{
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

    //2.Query og data by  id
    let imgOriginal : UpDateImg | undefined;
    let sql = mysql.format("select score from images where imgid = ?",[imgid])
    let result = await queryAsync(sql);
    const jsonStr =  JSON.stringify(result);
    const jsonobj = JSON.parse(jsonStr);
    const rowData = jsonobj;
    imgOriginal = rowData[0];
    if (!imgOriginal) {
        return res.status(404).json({ message: "Image not found" });
    }
    let scoreimg = updateimg.score + imgOriginal.score;
         sql = "update  `images` set `score`=? where `imgid`=?";
        sql = mysql.format(sql , [
            scoreimg,
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
