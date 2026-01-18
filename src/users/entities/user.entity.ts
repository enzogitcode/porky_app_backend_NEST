import { Prop } from "@nestjs/mongoose";

export class User {
    @Prop({unique:true, required:true})
    name:string

    @Prop({default:'user'})
    role:string

    @Prop({required:true})
    pinUser:string
}
