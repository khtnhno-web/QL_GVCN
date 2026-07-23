import { useEffect, useState } from "react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "./services/api";

function App() {

  const [students, setStudents] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  
const [search, setSearch] = useState("");

const [name, setName] = useState("");
const [lop, setLop] = useState("");

const [editingId, setEditingId] = useState(null);
const [isEditing, setIsEditing] = useState(false);
useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const data = await getStudents();
    setStudents(data);
  }
  function suaHocSinh(hs) {

  setName(hs["họ và tên"]);

  setLop(String(hs["lớp"]));

  setEditingId(hs.id);

  setIsEditing(true);

}
async function themHocSinh() {

  if (name.trim() === "" || lop.trim() === "") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  await addStudent({
 
  "mã học sinh": "",

  "họ và tên": name,

  "lớp": lop,

  "tổ": "",

  "giới tính": "",

  "ngày sinh": "",

  "địa chỉ": "",

  "trạng thái": "đang học",
});

setName("");
setLop("");

await loadStudents();
  alert("Đã gửi dữ liệu lên Google Sheets.");

}
async function luuThayDoi() {
console.log("name =", name, typeof name);
console.log("lop =", lop, typeof lop);

  if (String(name).trim() === "" || String(lop).trim() === "") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  console.log("Đang cập nhật ID:", editingId);

  const result = await updateStudent({
    id: editingId,
    "họ và tên": name,
    "lớp": lop,
  });

  console.log(result);

  setName("");
  setLop("");

  setEditingId(null);
  setIsEditing(false);

  await loadStudents();

  alert("Đã cập nhật học sinh.");
}
async function xoaHocSinh(id) {

  const xacNhan = window.confirm(
    "Bạn có chắc muốn xóa học sinh này không?"
  );

  if (!xacNhan) {
    return;
  }

  await deleteStudent(id);

  await loadStudents();

  alert("Đã xóa học sinh.");

}
const filteredStudents = students.filter((hs) =>
  hs["họ và tên"]
    .toLowerCase()
    .includes(search.toLowerCase())
);
  return (
    <div style={{padding:"30px"}}>

      <h1>Danh sách học sinh</h1>

<div style={{ marginBottom: "20px" }}>

  <input
    type="text"
    placeholder="Nhập họ tên"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    type="text"
    placeholder="Nhập lớp"
    value={lop}
    onChange={(e) => setLop(e.target.value)}
    style={{ marginLeft: "10px" }}
  />

  <button
  style={{ marginLeft: "10px" }}
  onClick={isEditing ? luuThayDoi : themHocSinh}
>
  {isEditing ? "Lưu thay đổi" : "Thêm học sinh"}
</button>

</div>
<div style={{ marginBottom: "20px" }}>
  <input
    type="text"
    placeholder="🔍 Tìm học sinh..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ width: "300px" }}
  />
</div>
      <table border="1" cellPadding="10">

        <thead>
  <tr>
    <th>ID</th>
    <th>Họ tên</th>
    <th>Lớp</th>
    <th>Thao tác</th>
  </tr>
</thead>

        <tbody>

  {filteredStudents.map((hs) => (
    <tr key={hs.id}>
      <td>{hs.id}</td>
      <td>{hs["họ và tên"]}</td>
      <td>{hs["lớp"]}</td>

      <td>
   <button onClick={() => suaHocSinh(hs)}>
  Sửa
</button>

    <button
      style={{ marginLeft: "10px" }}
  onClick={() => xoaHocSinh(hs.id)}
    >
      Xóa
    </button>

  </td>

</tr>
          ))}

        </tbody>

      </table>

    </div>
  );

}

export default App;