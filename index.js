const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "data.json");
const args = process.argv.slice(2);

if (args.length === 0) {
  showUsage();
  process.exit(0); // ออกจากโปรแกรมหลังแสดง usage
} 
const action = args[0];
const value = args[1];
const extraValue = args[2];


switch (action) {
  case "add":
    if (!value || value.trim() === "") {
      console.log("❌ Description is required for adding.");
    } else {
      createItem(value.trim());
    }
    break;

  case "update":
    validateIdAndRun(parseInt(value), () => {
      if (!extraValue || extraValue.trim() === "") {
        console.log("❌ Description is required for update.");
      } else {
        updateItem(parseInt(value), { discription: extraValue.trim() });
      }
    });
    break;

  case "delete":
    validateIdAndRun(parseInt(value), () => deleteItem(parseInt(value)));
    break;

  case "mark-in-progress":
    validateIdAndRun(parseInt(value), () =>
      updateItem(parseInt(value), { status: "in-progress" })
    );
    break;

  case "mark-done":
    validateIdAndRun(parseInt(value), () =>
      updateItem(parseInt(value), { status: "done" })
    );
    break;

  case "list":
    showList(value); // หากไม่มี value จะโชว์ทั้งหมด
    break;

  default:
    console.log(
      "❓ Unknown command. Available commands: add, update, delete, mark-in-progress, mark-done, list"
    );
}

// Helper: validate id ก่อนทำงาน
function validateIdAndRun(id, callback) {
  if (isNaN(id)) {
    console.log("❌ Invalid ID");
    return;
  }
  callback();
}

function readData() {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function createItem(description) {
  const data = readData();
  const newId = data.counterId + 1;

  const newItem = {
    id: newId,
    discription: description,
    status: "todo",
    createdAt: formatTimestamp(Date.now()),
  };

  data.list.push(newItem);
  data.counterId = newId;

  writeData(data);
  console.log("✅ Created:", newItem);
}

function updateItem(id, updatedFields) {
  const data = readData();
  const index = data.list.findIndex((item) => item.id === id);

  if (index === -1) {
    console.log("❌ Not found: ID", id);
    return;
  }

  data.list[index] = {
    ...data.list[index],
    ...updatedFields,
    updatedAt: formatTimestamp(Date.now()),
  };

  writeData(data);
  console.log("✅ Updated:", data.list[index]);
}

function deleteItem(id) {
  const data = readData();
  const index = data.list.findIndex((item) => item.id === id);

  if (index === -1) {
    console.log("❌ Not found: ID", id);
    return;
  }

  const removed = data.list.splice(index, 1)[0];
  writeData(data);
  console.log("🗑️ Deleted:", removed);
}

function showList(statusFilter) {
  const data = readData();
  let filteredList = data.list;

  if (statusFilter && statusFilter.trim() !== "") {
    filteredList = filteredList.filter(
      (item) => item.status === statusFilter.trim()
    );
  }

  if (filteredList.length === 0) {
    console.log("📭 No items found for status:", statusFilter || "all");
    return;
  }

  console.log("📋 List of items:");
  console.table(
    filteredList.map((item) => ({
      ID: item.id,
      Description: item.discription,
      Status: item.status,
    }))
  );
}

function formatTimestamp(timestamp, timeZone = "Asia/Bangkok") {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", "");
}

function showUsage() {
  console.log(`
📘 Usage Examples:

# Adding a new task
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1

# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
  `);
}
