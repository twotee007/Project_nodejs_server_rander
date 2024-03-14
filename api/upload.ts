import express from "express";
import multer from "multer";
import path from "path";

// router กำหนดเส้นทาง ของ api
export const router = express.Router();

// /upload
router.get("/",(req , res)=>{
    res.send("methon get ไอคิว get เข้ามา upload.ts");
});
// Define configgulation
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
// user fileupload object to handle uploading file
router.post("/",fileupload.diskLoader.single("file"), async (req,res)=>{
    // Create file name สร้างชื่อไฟล์
    const filename = Math.round(Math.random() * 10000) + ".png";
    // Set name to be save on filebase storage
    const storageRef = ref(storage, "images/" + filename);
    // Set detil of file to be uploaded
    const metadata ={
        contentType : req.file!.mimetype
    }
    //upload to storage
    const snapshot = await uploadBytesResumable(storageRef,req.file!.buffer,metadata);
    // Get URL image from storage
    const downloadUrl = await getDownloadURL(snapshot.ref);
    res.status(200).json({
        filename : downloadUrl
    });
});