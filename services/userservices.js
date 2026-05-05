const User = require("../models/user");

async function getAlluserList(requestedData) {
    const query = {};
    const filterField = [
      'familynumber',
      'name',
      'fathername',
      'surname',
      'petname',
      'fatherpetname',
      'surnamepetname',
      'mothername',
      'selectedGender',
      'email',
      'phone',
      'borndate',
      'sarkariyojna',
      'vaivhaikstiti',
      'daridrareshekahili',
      'chand',
      'language',
      'vaivsayname',
      'schoolname',
      'mahavidalay',
      'abyaskarm',
      'vibhag',
      'vaivsaynamevalue',
      'dharm',
      'cast',
      'upjat',
      'bloodgroup',
      'blooddonate',
      'vaisan',
      'ajar',
      'familydoctor',
      'bllodnodateplace',
      'vaisanname',
      'ajarname',
      'doctorname',
      'doctoraddress',
      'padvi',
      'adharcard',
      'pancard',
      'passport',
      'rashancard',
      'incometax',
      'votercard',
      'pancardno',
      'rashnacardname',
      'dukandarachename',
      'passportno',
      'incometaxn',
      'votercardname',
      'homeno',
      'sarkariyognalabh',
      'shauchalay',
      'hometype',
      'waterconnection',
      'chaviconnection',
      'gharphala',
      'panipatti',
      'kaushalya',
      'gyasconnection',
      'lightconnection',
      'yadinumber',
      'vidhansabha',
      'grampanchayat',
      'jilhaparishad',
      'sirialnumber',
      'lokshabha',
      'talukaparishad',
      'wardnumber',
      'matdar',
      'jamin',
      'sheti',
      'ghare',
      'adhikadhik',
      'aarthikvishleshan',
      'samjkarya',
      'rajkiypad',
      'rajkiyvishleshan',
      'rajkiypaksh',
      'samajkarya',
      'rajkiyPadName',
      'bankkhate',
      'sharedharak',
      'sadharabh',
      'vima',
      'vimanam',
      'bankkhatename',
      'bankkhateno',
      'sharedharakename',
      'mritvu',
      'mritvupramanpatra',
      'deathdate',
      'deathreason',
    ];
    
    // Add conditions based on the fields provided in requestedData
    filterField.forEach(field => {
      // Split the field by dots to handle nested fields
      const fieldParts = field.split('.');
      
      // Traverse the nested object in requestedData
      let value = requestedData;
      for (const part of fieldParts) {
        value = value[part];
      }
  
      // Add the condition to the query if the value is truthy
      if (value) {
        query[field] = value;
      }
    });

   const resp = User.find(requestedData).sort({ createdAt: -1 });
  return resp;
}

module.exports = {getAlluserList} 