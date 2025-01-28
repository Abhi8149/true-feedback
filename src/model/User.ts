import mongoose, {Schema,Document} from 'mongoose';

export interface message extends Document{
    _id:string;
    content:string;
    createdAt:Date;
}

const MessageSchema:Schema<message>=new Schema({
    content:{
        type:String,
        required:true
        },
        createdAt:{
            type:Date,
            default:Date.now
            }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifycode:string;
    isVerified: boolean;
    verifycodeExpiry:Date;
    isAccepetingMessage:boolean;
    messages:message[];
}

const Userschema: Schema<User>=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        },
        email:{
            type: String,
            required: [true, "please enter a valid email address"],
            unique: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please enter a valid email"]
          },
            password:{
                type:String,
                required:[true,'password  is required']
                },
                verifycode:{
                    type:String,
                    required:[true,'verify code is required'],
                },
                isVerified:{
                    type:Boolean,
                    default:false
                },
                verifycodeExpiry:{
                    type:Date,
                    required:[true,'verify code expiry is required'],
                },
                isAccepetingMessage:{
                    type:Boolean,
                    default:true
                },
                messages:{
                    type:[MessageSchema],
                    default:[]
                    }

})

//export
const Usermodel=(mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User',Userschema))

export default Usermodel;

