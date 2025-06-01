// อ่าน arguments จาก process.argv
const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2);

// ตัวอย่าง: พิมพ์คำทักทาย
const filePath = path.join(__dirname, "data.json");

let action = args[0];
for (let i = 0; i < args.length; i++) {
   if (action === "add") {
        let val = args[i+1];
        let data = read_file(val)
   } else if (action === "update"){

   }else if (action === "delete"){
    
   }else if (action === "mark-"){
    
   } else {
        console.log("error")
   }
    
}
function read_file(id)
{
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);
    const foundItem = data.list.find((item) => item.id === parseInt(id));
    if (foundItem) {
      return foundItem;
    } else {
      return { error: `ไม่พบข้อมูลที่มี id = ${id}` };
    }
  } catch (error) {
    return { error: "เกิดข้อผิดพลาดในการอ่านไฟล์หรือแปลง JSON" };
  }
}

