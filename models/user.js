const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  familynumber: String,
    name: {
        name: String,
        code: String
    },
    motherName: {
        name: String,
        code: String
    },
    petname: String,
    fatherpetname: String,
    surnamepetname: String,
    mothername: String,
    selectedGender: {
        name: String,
        code: String
    },
    email: String,
    phone: String,
    borndate: Date,
    sarkariyojna: Array,
    kaushalay: Array,
    vaivhaikstiti: {
        name: String,
        code: String
    },
    daridrareshekahili: {
        id: String,
        name: String
    },
    chand: Array,
    fathername: {
        name: String,
        code: String
    },
    surname: {
        name: String,
        code: String
    },
    language: Array,
    dist: {
        name: String,
        code: String
    },
    taluka: {
        name: String,
        code: String
    },
    addredetails: {
        name: String,
        code: String
    },
    pincode: {
        name: String,
        code: String
    },
    wardno: {
        name: String,
        code: String
    },
    othervisllagecome: {
        id: String,
        name: String
    },
    fulladdress: {
        name: String,
        code: String
    },
    othervillagecomename: {
        name: String,
        code: String
    },
    vaivsayname: Array,
    schoolname: {
        name: String,
        code: String
    },
    mahavidalay: {
        name: String,
        code: String
    },
    abyaskarm: Array,
    vibhag: {
        name: String,
        code: String
    },
    dharm: {
        name: String,
        code: String
    },
    cast: String,
    matdaroption: {
  id: {
    type: String
  },
  name: {
    type: String
  }
},
    upjat: {
        name: String,
        code: String
    },
    bloodgroup: {
        name: String,
        code: String
    },
    blooddonate: {
        id: String,
        name: String
    },
    vaisan: {
        id: String,
        name: String
    },
    ajar: {
        id: String,
        name: String
    },
    familydoctor: {
        id: String,
        name: String
    },
    apgatv: {
        id: String,
        name: String
    },
    bllodnodateplace: Array,
    vaisanname: Array,
    ajarname: Array,
    doctorname: String,
    doctoraddress: String,
    padvi: String,
    apagatavpramanpatr: String,
    apagatavtakevari: String,
    adharcard: String,
    pancard: {
        id: String,
        name: String
    },
    passport: {
        id: String,
        name: String
    },
    rashancard: {
        id: String,
        name: String
    },
    incometax: {
        id: String,
        name: String
    },
    votercard: {
        id: String,
        name: String
    },
    drivinglicence: {
        id: String,
        name: String
    },
    pancardno: String,
    passportno: String,
    rashnacardname: {
        id: String,
        name: String
    },
    dukandarachename: String,
    incometaxno: String,
    votercardname: String,
    drivinglincesname: Array,
    drivinglicencename: String,
    homeno: String,
    sarkariyognalabh: Array,
    shauchalay: {
        id: String,
        name: String
    },
    hometype: {
        name: String,
        code: String
    },
    waterconnection: {
        id: String,
        name: String
    },
    chaviconnection: {
        id: String,
        name: String
    },
    gharphala: {
        id: String,
        name: String
    },
    panipatti: {
        id: String,
        name: String
    },
    gyasconnection: {
        id: String,
        name: String
    },
    lightconnection: {
        id: String,
        name: String
    },
    panyachaprakar: Array,
    chavi: Array,
    gascompanyname: Array,
    agencyname: Array,
    vidhansabha: String,
    vidhantsabhasirialnumber: String,
    vidhansabhayadinumber: String,
    lokshabha: String,
    lokshabhaasirialnumber: String,
    lokshabhayadinumber: String,
    jilhaparishad: String,
    jilhaparishadsirialnumber: String,
    jilhaparishadyadinumber: String,
    grampanchayat: String,
    grampanchayatsirialnumber: String,
    grampanchayatyadinumber: String,
    talukaparishad: String,
    wardnumber: String,
    matdar: Array,
    jamin: Array,
    sheti: Array,
    samajkaryavalue:Array,
    ghare: {
        id: String,
        name: String
    },
    aarthikvishleshan: Array,
    Janavare:  {
        id: String,
        name: String
    },
    vahane: {
        id: String,
        name: String
    },
    samjkarya: {
        id: String,
        name: String
    },
    rajkiypad: {
        id: String,
        name: String
    },
    rajkiyvishleshan: Array,
    rajkiypaksh: Array,
    samajkarya: Array,
    rajkiyPadName: Array,
    bankkhate: {
        id: String,
        name: String
    },
    sharedharak: {
        id: String,
        name: String
    },
    sadharabh: {
        id: String,
        name: String
    },
    rastyacheprakar:Array,
    gatarselected:Array,
    lambi:Number,
    rundi:Number,
    squarefeet:Number,
    sandharabhname:String,
    sandharabhaddress:String,
    sandharabhphone:String,
    vaivsaynamevalue:Array,
    nokri: Array,
    vima: {
        id: String,
        name: String
    },
    bankkhatename: Array,
    bankkhateno: Array,
    sharedharakename: Array,
    vimaname: Array,
    mritvu: String,
    mritvupramanpatra: String,
    deathdate: Date,
    deathreason: String,
    userImage:{
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    vahanahanedetails: Array,
    janavarSections:Array,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});



// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
