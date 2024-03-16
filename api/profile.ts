import express from "express";
import {conn, mysql} from "../dbcon";
import { SignUpGet } from "../model/login_get";
import multer from "multer";
export const router = express.Router();


router.get("/:uid", (req, res) => {
    let uid = +req.params.uid;
    const sql ="SELECT * FROM images WHERE images.uid = ?";
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

const firebaseConfig = {
    apiKey: "AIzaSyA9QTMwY1-ngMzE18bRVRI08Rq5FTXpSnI",
    authDomain: "catmash-50619.firebaseapp.com",
    projectId: "catmash-50619",
    storageBucket: "catmash-50619.appspot.com",
    messagingSenderId: "1042486206578",
    appId: "1:1042486206578:web:ea0fc549f7823ee95022eb",
    measurementId: "G-5QPRCM296E"
  };
  //import libs
  import { initializeApp } from "firebase/app";
  import { getStorage,ref,getDownloadURL,uploadBytesResumable } from "firebase/storage";
  // strat connecting to firebase
  initializeApp(firebaseConfig);
  //create object from filebase storage
  const storage = getStorage();


class FileMiddleware {
    filename = "";
    // create multer object to save file in disk
    public readonly diskLoader = multer({
        // diskStorage = save to memmory
      storage: multer.memoryStorage(),
      // limit size
      limits: {
        fileSize: 67108864, // 64 MByte
      },
    });
  }
// post upload
const fileupload = new FileMiddleware();
router.post("/addimg", fileupload.diskLoader.single("file"), async (req, res) => {
    // ตรวจสอบว่ามีการอัปโหลดไฟล์หรือไม่
    if (!req.file) {
        // ถ้าไม่มีไฟล์อัปโหลด
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    try {
        // จัดการกับการอัปโหลดไฟล์ภาพ และข้อมูลผู้ใช้
        const { name, uid } = req.body; // รับข้อมูลจากฟอร์ม
        
        // Convert uid to integer
        const intUid = parseInt(uid, 10);
        
        // Create file name
        const filename = Math.round(Math.random() * 10000) + ".png";
        // Set name to be saved on Firebase storage
        const storageRef = ref(storage, "images/" + filename);
        // Set details of the file to be uploaded
        const metadata ={
            contentType : req.file.mimetype
        }
        // Upload to storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        // Get URL image from storage
        const downloadUrl = await getDownloadURL(snapshot.ref);
        
        // Insert user data into database
        let sql = "INSERT INTO `images`(`imgurl`,`name`, `uid`) VALUES (?, ?, ?)";
        sql = mysql.format(sql, [
            downloadUrl,
            name,
            intUid 
        ]);
        conn.query(sql, (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            return res.status(201).json({ affected_row: result.affectedRows });
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});