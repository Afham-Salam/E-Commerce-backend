
const mongoose=require("mongoose")

const orderScehme=new mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
          },
          products: [
            {
              productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
              },
              quantity: { 
                type: Number,
                required: true,
                default: 1  
              }
            }
          ],
          totalAmount: { 
            type: Number,
            
          },
          paymentId: { 
            type: String,
          },
          totalItems: { 
            type: Number,
          },
          customerName: {
            type: String,
          },
          address:{
            type:String
        },
          city: {
            type: String,
          },
          state: {
            type: String,
          },
          pincode: {
            type: Number,
          },
          contact: {
            type: Number,
          },
        
        
        },{timestamps: true})

      const Order=mongoose.model("Order",orderScehme)
      module.exports=Order;
