import mongoose, { Schema } from 'mongoose';

import jwt from 'jsonwebtoken';

const vechileSchme = new Schema(
    {
       nameOfEmployee:{
        type : String,
        required : true
       } ,
       Employee_No :{
        type : String,
        required : true
       } ,
       vechileRequiredFor:{
        type : String,
        required : true
       } ,
       journeyUndertaken:{
        type : String,
        required : true
       } ,
       vechileRequiredDate:{
        type : Date,
        required : true
       } ,
       vechileRequiredAddress: {
        type : String,
        required : true
       },
       returnVechileTime :{
        type : String,
        required : true
       },
       signatureOfEmployee : {
        type : String,
        required : true
       },
       signatureOfHOD:{
        type : String,
        
       }



},{timestamps : true}
)

export default  mongoose.model('User', vechileSchme);