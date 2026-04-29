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



module.exports = userRoute;
