const express = require("express");
const mongoose = require("mongoose");
const { reset } = require("nodemon");

const app = express();

app.use(express.json());


const connect=() => {
  return mongoose.connect("mongodb://127.0.0.1:27017/banks")
}

app.listen(8000, async(req,res)=>{
  await connect();

  console.log("Listining on port 8000")
})


// user schema

const userSchema = new mongoose.Schema({
  firstName:{type:String, require:true},
  middleName:{type:String, require:true},
  lastName: {type:String, require:true},
  age:{type:Number, require:true},
  email:{type:String, require:true},
  address:{type:String, require:true},
  gender:{type:String, require:false, default:"female"},
  master:{type:mongoose.Schema.Types.ObjectId,require:true, ref:"master"},
  savings:[{type:mongoose.Schema.Types.ObjectId,require:true, ref:"savings"}]
  

},
{
  versionKey:false,
  timestamps:true
}
);


const User = mongoose.model("user",userSchema)
// crud for users

app.post("/users", async(req,res) => {
  try{
    const user =await User.create(req.body)
    return res.status(201).send(user);
  }
  catch(e){
    return res.status(500).send(e.message)
  }
  
})

app.get("/users",async(req,res)=>{
  try{
      const user = await User.find().populate("master").populate("savings").lean().exec();
      return res.status(201).send(user);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

app.get("/users/:id",async(req,res)=>{
  try{
      const fixed = await User.findById(req.params.id).lean().exec();
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

app.patch("/users/:id",async(req,res)=>{
  try{
      const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,}).lean().exec();
      return res.status(201).send(user);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.delete("/users/:id",async(req,res)=>{
  try{
      const user = await User.findByIdAndDelete(req.params.id).lean().exec();
      return res.status(201).send(user);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

// branch details

const branchSchema = new mongoose.Schema({
  name:{type:String, require:true},
  address:{type:String, require:true},
  IFSC :{type:String, require:true},
  MICR :{type:Number,require:true},
  master:{type:mongoose.Schema.Types.ObjectId,require:true, ref:"master"}

},
{
  versionKey:false,
  timestamps:true
}
);

const Branch = mongoose.model("branch",branchSchema)

// crud

app.post("/branch", async(req,res) => {
  try{
    const branch = await Branch.create(req.body)
    return res.status(201).send(branch);

  }
  catch(e){
    return res.status(500).send(e.message)
  }
})

app.get("/branch",async(req,res) => {
  try{
    const branch = await Branch.find().populate("master").lean().exec();
    return res.status(201).send(branch);

  }
  catch(e){
    return res.status(500).send(e.message)
  }
})

app.get("/branch/:id",async(req,res)=>{
  try{
      const fixed = await Branch.findById(req.params.id).lean().exec();
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.patch("/branch/:id",async(req,res)=>{
  try{
      const branch = await Branch.findByIdAndUpdate(req.params.id,req.body,{new:true,}).lean().exec();
      return res.status(201).send(branch);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.delete("/branch/:id",async(req,res)=>{
  try{
      const branch = await Branch.findByIdAndDelete(req.params.id).lean().exec();
      return res.status(201).send(branch);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})


// masteraccount
const masterSchema = new mongoose.Schema({
  user:[{type: mongoose.Schema.Types.ObjectId,req:true,ref:"users"}],
  balance:{type:Number, require:true},
  fixed:[{type:mongoose.Schema.Types.ObjectId,require:true, ref:"fixed"}]
},
{
  versionKey:false,
  timestamps:true
}
);

const Master = mongoose.model("master",masterSchema)

//crud
app.post("/master" , async(req,res)=>{
  try{
      const master = await Master.create(req.body)
      return res.status(201).send(master);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

app.get("/master",async(req,res)=>{
  try{
      const master = await Master.find().populate("fixed").lean().exec();
      return res.status(201).send(master);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.get("/master/:id",async(req,res)=>{
  try{
      const fixed = await Master.findById(req.params.id).lean().exec();
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.patch("/master/:id",async(req,res)=>{
  try{
      const master = await Master.findByIdAndUpdate(req.params.id,req.body,{new:true,}).lean().exec();
      return res.status(201).send(master);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.delete("/master/:id",async(req,res)=>{
  try{
      const master = await Master.findByIdAndDelete(req.params.id).lean().exec();
      return res.status(201).send(master);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

// savings

const saveSchema = new mongoose.Schema({
  accountNo:{type:Number, required:true, unique:true},
  balance :[
      {type:mongoose.Schema.Types.ObjectId,require:true, ref:"master"}
  ],
  intrestRate:{type:Number,require:true},

},
{
  versionKey:false,
  timestamps:true
}
);

const Savings = mongoose.model("savings",saveSchema)
// cruds

app.post("/savings" , async(req,res)=>{
  try{
      const savings = await Savings.create(req.body)
      return res.status(201).send(savings);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

app.get("/savings",async(req,res)=>{
  try{
      const savings = await Savings.find().populate("master").lean().exec();
      return res.status(201).send(savings);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.get("/savings/:id",async(req,res)=>{
  try{
      const fixed = await Savings.findById(req.params.id).lean().exec();
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.patch("/savings/:id",async(req,res)=>{
  try{
      const savings = await Savings.findByIdAndUpdate(req.params.id,req.body,{new:true,}).lean().exec();
      return res.status(201).send(savings);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.delete("/savings/:id",async(req,res)=>{
  try{
      const savings = await Savings.findByIdAndDelete(req.params.id).lean().exec();
      return res.status(201).send(savings);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

// fixed account

const fixedSchema = new mongoose.Schema({
  accountNo:{type:Number, required:true, unique:true},
  balance :[
      {type:mongoose.Schema.Types.ObjectId,require:true, ref:"master"}
  ],
  intrestRate:{type:Number,require:true},
  startDate :{type:Number,require:true},
  maturityDate:{type:Number,require:true},

},
{
  versionKey:false,
  timestamps:true
}
);

const Fixed = mongoose.model("fixed",saveSchema)


//CRUD for branch DEtailes;
app.post("/fixed" , async(req,res)=>{
  try{
      const fixed = await Fixed.create(req.body)
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

app.get("/fixed",async(req,res)=>{
  try{
      const fixed = await Fixed.find().populate("master").lean().exec();
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.get("/fixed/:id",async(req,res)=>{
  try{
      const fixed = await Fixed.findById(req.params.id).lean().exec();
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.patch("/fixed/:id",async(req,res)=>{
  try{
      const fixed = await Fixed.findByIdAndUpdate(req.params.id,req.body,{new:true,}).lean().exec();
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})
app.delete("/fixed/:id",async(req,res)=>{
  try{
      const fixed = await Fixed.findByIdAndDelete(req.params.id).lean().exec();
      return res.status(201).send(fixed);
  }
  catch(e){
      return res.status(500).send(e.message)
  }
})

