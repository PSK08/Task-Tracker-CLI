// อ่าน arguments จาก process.argv
const fs = require('fs');
const path = require("path");
const filePath = path.join(__dirname, "data.json");
const args = process.argv.slice(2);
const Datetime = Date.now();

// ตัวอย่าง: พิมพ์คำทักทาย
const action = args[0];
const value = args[1];
const extra_value = args[2];

if (action === "add") {
  createItem(value);
} else if (action === "update") {
  updateItem(parseInt(value), {discription:extra_value});
} else if (action === "delete"){
  deleteItem(parseInt(value));
} else if (action === "mark-in-progress"){
  updateItem(parseInt(value), {status:"in-progress"});
} else if (action === "mark-done"){
  updateItem(parseInt(value), {status:"done"});
} else if (action === "list" && value !== undefined) {
  showList(value);
}else if (action === "list") {
  showList();
}

// Helper: อ่านไฟล์ JSON
function readData() {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// Helper: เขียนข้อมูลลงไฟล์
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// CREATE: เพิ่มรายการใหม่
function createItem(des) {
  const data = readData();
  const newId = data.counterId + 1;
  const status = "todo";

  const newItem = {
    id: newId,
    discription:des,
    status:status,
    createdAt: formatTimestamp(Datetime)
  };

  data.list.push(newItem);
  data.counterId = newId;

  writeData(data);
  console.log('Completed Create!:', newItem);
}

// UPDATE: แก้ไขข้อมูลตาม id
function updateItem(id, updatedFields) {
  const data = readData();
  const index = data.list.findIndex(item => item.id === id);
  
  

  if (index === -1) {
    console.log('Not found: ID', id);
    return;
  }

  data.list[index] = {
    ...data.list[index],
    ...updatedFields,
    updatedAt:formatTimestamp(Datetime)
  };

  writeData(data);
  console.log('Completed Update!:', data.list[index]);
}

// DELETE: ลบข้อมูลตาม id
function deleteItem(id) {
  const data = readData();
  const index = data.list.findIndex(item => item.id === id);

  if (index === -1) {
    console.log('Not found: ID', id);
    return;
  }

  const removed = data.list.splice(index, 1)[0];
  writeData(data);
  console.log('Completed Delete!:', removed);
}


function formatTimestamp(timestamp, timeZone = 'Asia/Bangkok') {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date).replace(',', '');
}

function showList(statusFilter) {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(rawData);
  
  let filteredList = jsonData.list;

  if (statusFilter) {
    filteredList = filteredList.filter(item => item.status === statusFilter);
  }

  if (filteredList.length === 0) {
    console.log('Not found: Status', statusFilter);
    return;
  }

  // แสดงหัวตาราง
  console.log('ID\tDescription\t\tStatus');
  console.log('--\t-----------\t\t------');

  // แสดงข้อมูลทีละแถว
  filteredList.forEach(item => {
    console.log(`${item.id}\t${item.discription}\t\t${item.status}`);
  });
}
