import fs from "fs/promises";
import { Command } from "commander";
const cmd = new Command();


const data = await fs.readFile("./users.json", "utf-8");
let parsedData = JSON.parse(data);
//console.log("🚀 ~ parsedData:", parsedData);
// const [,, action, id] = process.argv;
// function getOne(id){
//     console.log(parsedData.find((user)=> user.id === parseInt(id)));
// }

// switch (action) {
//     case 'getone':
//         getOne(id)
//         break;

//     default:
//         break;
// }
/*const newUser = {
  id: 3,
  Name: "Mona",
};*/
/*let arr = [];
if (Array.isArray(parsedData)) parsedData.push(newUser);
else parsedData = [parsedData, newUser];
console.log("🚀 ~ parsedData:", parsedData);*/



//const [,, action,name,id] = process.argv;
/************************Add User************************************/
const incID=()=>{
    let max=0;
    for(const user of parsedData ){
        if(user.id>max){
            max=user.id;
        }
    }
    return max+1;
}
function adduser(name){
let user={
    id :incID(),
    Name: name
};
parsedData.push(user);
console.log(user);
}

/***********************Remove User************************************************/
function removeuser(id){
let user=parsedData.findIndex(user => user.id == parseInt(id));
parsedData.splice(user,1);
console.log("deleted succes");
}

/************************get All users***********************************************************/
function getallusers(){
    console.log(parsedData);
}

/************************get one user***********************************************************************/
function getuserbyid(id){
let user=parsedData.find(user => user.id === parseInt(id));
console.log(user)
}

/************************Update useer************************************************************************************/
function edituser(name,id){
    let user=parsedData.find(user => user.id === parseInt(id));
    user.Name=name;
    console.log("Name Updated");
}

/////////////////////////////////Command//////////////////////////////////
function save() {
   fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
}

cmd
  .command("add <name>")
  .action((name) => {
    adduser(name);
    save();
  });

cmd
  .command("remove <id>")
  .action((id) => {
    removeuser(id);
    save();
  });

cmd
  .command("getall")
  .action(() => {
    getallusers();
  });

cmd
  .command("getone <id>")
  .action((id) => {
    getuserbyid(id);
  });

cmd
  .command("edit <id> <name>")
  .action((id, name) => {
    edituser(id, name);
    save();
  });
  cmd.parse(process.argv);
 



// add name -> unique id 
// remove id 
// edit id www



