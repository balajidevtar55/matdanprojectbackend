const express = require("express");
const userRoute = express.Router();
const User = require("../models/user");
const logger = require('../utility/logger');
const mongoose = require('mongoose');
const cors = require('cors');
const { getAlluserList } = require("../services/userservices");
userRoute.use(cors());
const multer = require('multer');
const upload = multer({dest:'uploads/'})
userRoute.use("/uploads",express.static('uploads'));
var PlexAPI = require("plex-api");
var client = new PlexAPI("199.79.63.188");
const cloudinary = require('cloudinary');
const XLSX = require("xlsx");
const fs = require("fs");
// Create a user
userRoute.route("/create").post(upload.single("userImage"),async (req, res) => {
  try {

    const json = JSON.parse(req.body.json);
  const userImage =req.file?.path;
    const respData = {
      ...json,'userImage':userImage
    }


    cloudinary.config({ 
      cloud_name: 'dxmw5ftsc', 
      api_key: '434511147799427', 
      api_secret: 'vEVqtYsLIu_zfGumDy7x5QOKfec' // Click 'View Credentials' below to copy your API secret
  });

  const myCloud = await cloudinary.v2.uploader.upload(userImage, {
    folder: "avatars",
    width: 150,
    crop: "scale",
});

    
    const responseData = new User({
      ...respData,
      userImage: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    }); 
   responseData.save()

    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "User Created SuccessFully", 
      responseData: responseData,
    });
  } catch (error) {
    logger.error("Error in route create user", error);
    res.status(500).json({
      responseCode: 500,
      responseStatus: "error",
      responseMsg: "Something went wrong!..",
    });
  }
});

// userRoute.route("/uploadImage").post(upload.single("userImage"),async (req, res) => {


//   try {

     

//     res.json({
//       responseCode: 200,
//       responseStatus: "success",
//       responseMsg: "User Created SuccessFully", 
//       // responseData: responseData,
//     });
//   } catch (error) {
//     logger.error("Error in route create user", error);
//     res.status(500).json({
//       responseCode: 500,
//       responseStatus: "error",
//       responseMsg: "Something went wrong!..",
//     });
//   }
// });


// update Records

// client.postQuery("/TETS").then(function (result) {
// 	console.log("%s running Plex Media Server v%s",
// 		result.friendlyName,
// 		result.version);

// 	// array of children, such as Directory or Server items
// 	// will have the .uri-property attached
// 	console.log(result._children);
// }, function (err) {
// 	console.error("Could not connect to serverssss by ref", err);
// });
// userRoute.post('/update', async (req, res) => {
//   try {

//     const json = req.body;
//     const userImage = req.file;
//     //   const respData = {
//     //     ...json,'userImage':userImage
//     //   }
//     //   try {
//     //     const updatedUser = await User.findByIdAndUpdate(
//     //       req.params.id,
//     //       json,
//     //     );
//     //     if (updatedUser) {
//     //       res.json({
//     //         responseCode: 200,
//     //         responseStatus: "success",
//     //         responseMsg: "User Updated  SuccessFully",
//     //         responseData: updatedUser,
//     //       });
//     //     } else {
//     //       console.log('User not found');
//     //     }
//     //   } catch (err) {
//     //     console.error(err);
//     //   }

//     console.log('respdata:', json); 
//     console.log('userImage:', userImage);
//     cloudinary.config({ 
//       cloud_name: 'dxmw5ftsc', 
//       api_key: '434511147799427', 
//       api_secret: 'vEVqtYsLIu_zfGumDy7x5QOKfec' // Click 'View Credentials' below to copy your API secret
//   });
//   console.log("json",userImage);

//   if(userImage){

//     const user = await User.findById(req.params.id);

//     const imageId = user.userImage.public_id;

//     await cloudinary.v2.uploader.destroy(imageId);

//     const myCloud = await cloudinary.v2.uploader.upload(userImage, {
//         folder: "avatars",
//         width: 150,
//         crop: "scale",
//     });

//     json.userImage = {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
// }
//   }
//   await User.findByIdAndUpdate(req.params.id, json, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: true,
// });

// res.status(200).json({
//   success: true,
// });
    
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

userRoute
  .route("/update")
  .post(upload.single("userImage"), async (req, res) => {
    try {

      const json = JSON.parse(req.body.json);

      const userImage = req.file?.path;
      cloudinary.config({ 
        cloud_name: "dxmw5ftsc",
        api_key: "434511147799427",
        api_secret: "vEVqtYsLIu_zfGumDy7x5QOKfec",
      });
      
     
      
      if (userImage) { // Check if userImage is truthy
        try {
          const user = await User.findById(req.body.id);
          
          if (user && user.userImage && user.userImage.public_id) {
            const imageId = user.userImage.public_id;
            
            try {
              await cloudinary.v2.uploader.destroy(imageId);
            } catch (destroyError) {
              console.error(`Failed to delete image with ID ${imageId}: ${destroyError.message}`);
            }
          }
          
          try {
            const myCloud = await cloudinary.v2.uploader.upload(userImage, {
              folder: "avatars",
              width: 150,
              crop: "scale",
            });
            
            json.userImage = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
          } catch (uploadError) {
            console.error(`Failed to upload new image: ${uploadError.message}`);
            // Handle the error as needed (e.g., send an error response)
          }
        } catch (findError) {
          console.error(`Failed to find user: ${findError.message}`);
          // Handle the error as needed (e.g., send an error response)
        }
      }
      
      try {
        const responseData = await User.findByIdAndUpdate(req.body.id, json, {
          new: true,
          runValidators: true,
          useFindAndModify: true,
        });
        
        res.json({
          responseCode: 200,
          responseStatus: "success",
          responseMsg: "User Updated Successfully",
          responseData: responseData,
        });
      } catch (updateError) {
        console.error(`Failed to update user: ${updateError.message}`);
        res.status(500).json({
          responseCode: 500,
          responseStatus: "error",
          responseMsg: "Failed to update user",
        });
      }
    } catch (error) {
      logger.error("Error in route create user", error);
      res.status(500).json({
        responseCode: 500,
        responseStatus: "error",
        responseMsg: "Something went wrong!..",
      });
    }
  });

// list of records
userRoute.get("/",async(req,res)=>{
  try {
    const userList = await User.find();
    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "User List SuccessFully",
      responseData: userList,
    });

  } catch (error) {
    res.status(500).json({ error: err.message });

  }
})

//delete of Records
userRoute.delete("/:id",async(req,res)=>{
  try {
    cloudinary.config({
      cloud_name: "dxmw5ftsc",
      api_key: "434511147799427",
      api_secret: "vEVqtYsLIu_zfGumDy7x5QOKfec",
    });
    const user = await User.findById(req.params.id);

    if (user && user.userImage && user.userImage.public_id) {
      const imageId = user.userImage.public_id;
    
      try {
        await cloudinary.v2.uploader.destroy(imageId);
        console.log(`Image with ID ${imageId} has been deleted.`);
      } catch (error) {
        console.error(`Failed to delete image with ID ${imageId}: ${error.message}`);
      }
    }
 
    const deletedRecord = await User.findByIdAndDelete(req.params.id);
    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "User Deleted SuccessFully",
      responseData: deletedRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
})

//delete of Records
userRoute.get("/:id",async(req,res)=>{
  try {
    const findDetailById = await User.findById(req.params.id);
    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "User Deleted SuccessFully",
      responseData: findDetailById,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
})


// Get tasks for a specific user based on email
userRoute.post('/filter', async (req, res) => {
  try {
    const tasks = await getAlluserList(req.body.filters);
    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "User Deleted SuccessFully",
      responseData: tasks,
    });
  } catch (error) {
    res.status(500).json({
      responseCode: 500,
      responseStatus: "error",
      responseMsg: "Something went wrong!..",
    });
  }
});



const mapNameCode = (name, code) =>
  name || code ? { name: name || "", code: code || "" } : undefined;

const mapIdName = (id, name) =>
  id || name ? { id: id || "", name: name || "" } : undefined;

const mapArray = (value) =>
  value ? value.split(",").map(v => v.trim()) : [];

const mapDate = (value) =>
  value ? new Date(value) : null;

// ===== CONTROLLER =====
const uploadUsersFromExcel = async (req, res) => {
  try {
     console.log("FILE:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    // 1. Read Excel
    const workbook = XLSX.readFile(req.file.path);
     console.log("Sheet Names:", workbook.SheetNames);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log("ROWS:", rows);

    if (!rows.length) {
      return res.status(400).json({ message: "Excel is empty" });
    }

    const users = [];
    const errors = [];

    // 2. Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        // ===== BASIC VALIDATION =====
        if (!row.name || !row.phone) {
          errors.push({
            row: i + 1,
            message: "Name and phone are required",
          });
          continue;
        }

        // ===== BUILD USER OBJECT =====
        const userObj = {
          familynumber: row.familynumber,

          name: mapNameCode(row.name, row.name_code),
          motherName: mapNameCode(row.motherName, row.motherName_code),
          fathername: mapNameCode(row.fathername, row.fathername_code),
          surname: mapNameCode(row.surname, row.surname_code),

          petname: row.petname,
          fatherpetname: row.fatherpetname,
          surnamepetname: row.surnamepetname,
          mothername: row.mothername,

          selectedGender: mapNameCode(row.gender, row.gender_code),

          email: row.email,
          phone: row.phone,

          borndate: mapDate(row.borndate),

          sarkariyojna: mapArray(row.sarkariyojna),
          kaushalay: mapArray(row.kaushalay),
          chand: mapArray(row.chand),
          language: mapArray(row.language),

          vaivhaikstiti: mapNameCode(row.vaivhaikstiti, row.vaivhaikstiti_code),

          daridrareshekahili: mapIdName(row.daridra_id, row.daridra_name),

          dist: mapNameCode(row.dist, row.dist_code),
          taluka: mapNameCode(row.taluka, row.taluka_code),
          addredetails: mapNameCode(row.addredetails, row.addredetails_code),
          pincode: mapNameCode(row.pincode, row.pincode_code),
          wardno: mapNameCode(row.wardno, row.wardno_code),

          fulladdress: mapNameCode(row.fulladdress, row.fulladdress_code),

          othervisllagecome: mapIdName(row.otherVillage_id, row.otherVillage_name),
          othervillagecomename: mapNameCode(
            row.otherVillageName,
            row.otherVillageName_code
          ),

          schoolname: mapNameCode(row.schoolname, row.schoolname_code),
          mahavidalay: mapNameCode(row.mahavidalay, row.mahavidalay_code),
          abyaskarm: mapArray(row.abyaskarm),
          vibhag: mapNameCode(row.vibhag, row.vibhag_code),

          dharm: mapNameCode(row.dharm, row.dharm_code),
          cast: row.cast,
          upjat: mapNameCode(row.upjat, row.upjat_code),

          bloodgroup: mapNameCode(row.bloodgroup, row.bloodgroup_code),
          blooddonate: mapIdName(row.blooddonate_id, row.blooddonate_name),
          vaisan: mapIdName(row.vaisan_id, row.vaisan_name),
          ajar: mapIdName(row.ajar_id, row.ajar_name),
          familydoctor: mapIdName(row.familydoctor_id, row.familydoctor_name),
          apgatv: mapIdName(row.apgatv_id, row.apgatv_name),

          bllodnodateplace: mapArray(row.bllodnodateplace),
          vaisanname: mapArray(row.vaisanname),
          ajarname: mapArray(row.ajarname),

          doctorname: row.doctorname,
          doctoraddress: row.doctoraddress,

          pancard: mapIdName(row.pancard_id, row.pancard_name),
          passport: mapIdName(row.passport_id, row.passport_name),
          rashancard: mapIdName(row.rashancard_id, row.rashancard_name),
          incometax: mapIdName(row.incometax_id, row.incometax_name),
          votercard: mapIdName(row.votercard_id, row.votercard_name),
          drivinglicence: mapIdName(
            row.drivinglicence_id,
            row.drivinglicence_name
          ),

          pancardno: row.pancardno,
          passportno: row.passportno,
          incometaxno: row.incometaxno,

          shauchalay: mapIdName(row.shauchalay_id, row.shauchalay_name),
          hometype: mapNameCode(row.hometype, row.hometype_code),
          waterconnection: mapIdName(
            row.waterconnection_id,
            row.waterconnection_name
          ),
          lightconnection: mapIdName(
            row.lightconnection_id,
            row.lightconnection_name
          ),

          panyachaprakar: mapArray(row.panyachaprakar),
          gascompanyname: mapArray(row.gascompanyname),

          vidhansabha: row.vidhansabha,
          lokshabha: row.lokshabha,
          grampanchayat: row.grampanchayat,

          jamin: mapArray(row.jamin),
          sheti: mapArray(row.sheti),

          samajkarya: mapArray(row.samajkarya),
          rajkiypaksh: mapArray(row.rajkiypaksh),

          bankkhate: mapIdName(row.bankkhate_id, row.bankkhate_name),
          bankkhatename: mapArray(row.bankkhatename),
          bankkhateno: mapArray(row.bankkhateno),

          vima: mapIdName(row.vima_id, row.vima_name),
          vimaname: mapArray(row.vimaname),

          mritvu: row.mritvu,
          deathdate: mapDate(row.deathdate),
          deathreason: row.deathreason,
        };

        users.push(userObj);
      } catch (err) {
        errors.push({
          row: i + 1,
          message: err.message,
        });
      }
    }

     console.log("FINAL USERS:", users);
    // 3. Insert into DB
    let inserted = [];
    if (users.length) {
      inserted = await User.insertMany(users, { ordered: false });
    }

    // 4. Delete temp file
    fs.unlinkSync(req.file.path);

    // 5. Response
    res.json({
      success: true,
      totalRows: rows.length,
      inserted: inserted.length,
      failed: errors.length,
      errors: errors,
    });

  } catch (error) {
    console.error(error);

    if (req.file) fs.unlinkSync(req.file.path);

    res.status(500).json({
      success: false,
      message: "Excel upload failed",
    });
  }
};

userRoute.post(
  "/upload-excel",
  upload.single("file"),
  uploadUsersFromExcel
);

module.exports = userRoute;
