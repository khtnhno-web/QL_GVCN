import { useEffect, useState } from "react";
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import {
    getBehavior,
    addBehavior,
    updateBehavior,
    deleteBehavior,
    getStudents,
    getCriteria,
    addCriteria,
    updateCriteria,
    deleteCriteria

} from "./services/api";

function Behavior() {

    const [behaviors, setBehaviors] = useState([]);
    const [criteria, setCriteria] = useState([
        {
            id: 1,
            name: "Hăng hái phát biểu",
            type: "Khen",
            score: 2,
            content: "Hăng hái phát biểu xây dựng bài"
        },
        {
            id: 2,
            name: "Giúp đỡ bạn",
            type: "Khen",
            score: 2,
            content: "Giúp đỡ bạn trong học tập"
        },
        {
            id: 3,
            name: "Đi học muộn",
            type: "Nhắc",
            score: -2,
            content: "Đi học muộn"
        }
    ]);
    const [selectedCriteria, setSelectedCriteria] = useState("");
    const [excelFile, setExcelFile] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [reportMonth, setReportMonth] = useState("");
    const [reportType, setReportType] = useState("month");

    // =========================
// PHIẾU GỬI PHỤ HUYNH
// =========================

const [parentReportType, setParentReportType] = useState("week");

const [parentMonth, setParentMonth] = useState("");

const [parentWeekStart, setParentWeekStart] = useState("");

const [parentWeekEnd, setParentWeekEnd] = useState("");

const [parentStudent, setParentStudent] = useState("");

    const [weekStart, setWeekStart] = useState("");
    const [weekEnd, setWeekEnd] = useState("");

    const [students, setStudents] = useState([]);
    // =====================
    // TIÊU CHÍ
    // =====================

        const [showCriteria, setShowCriteria] = useState(false);

    const [criteriaName, setCriteriaName] = useState("");

    const [criteriaType, setCriteriaType] = useState("Khen");

    const [criteriaPoint, setCriteriaPoint] = useState(1);

    const [editingCriteriaId, setEditingCriteriaId] = useState(null);

    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);

    const [searchStudent, setSearchStudent] = useState("");
    const [behaviorDate, setBehaviorDate] = useState("");

    const [behaviorType, setBehaviorType] = useState("Khen");

    const [behaviorContent, setBehaviorContent] = useState("");

    const [behaviorPoint, setBehaviorPoint] = useState("");

    const [editingBehaviorId, setEditingBehaviorId] = useState(null);
const [isEditingBehavior, setIsEditingBehavior] = useState(false);
    // =======================
// AI
// =======================

    const selectedStudentInfo = students.find(
        (hs) => String(hs.id) === String(selectedStudent)
    );
    useEffect(() => {

        loadBehavior();

        loadStudents();

        loadCriteria();

    }, []);

    async function loadBehavior() {
        const data = await getBehavior();
        setBehaviors(data);
    }
    function suaNeNep(item) {

    setEditingBehaviorId(item.recordid);

    setSelectedStudent(item.studentid);

    setBehaviorDate(item["ngày"]);

    setBehaviorType(item["loại"]);

    setBehaviorContent(item["nội dung"]);

    setBehaviorPoint(item["điểm"]);

    setIsEditingBehavior(true);

}
    async function xoaNeNep(id) {

    const xacNhan = window.confirm(
        "Bạn có chắc muốn xóa bản ghi này không?"
    );

    if (!xacNhan) return;

    await deleteBehavior(id);

    await loadBehavior();

    alert("Đã xóa.");
}
    async function loadStudents() {

        const data = await getStudents();

        setStudents(data);

    }

    async function loadCriteria() {

        const data = await getCriteria();

        setCriteria(data);

    }

    function docFileExcel(file) {

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, {
                type: "array",
            });

            const sheetName = workbook.SheetNames[0];

            const sheet = workbook.Sheets[sheetName];

            const json = XLSX.utils.sheet_to_json(sheet);

            console.log("Đã đọc Excel");

            console.log(json);

            console.log("Số dòng:", json.length);

            setExcelData(json);
            const ids = [];

            json.forEach((row) => {

                const maHS = String(
                    row["Mã học sinh"] || row["mã học sinh"] || ""
                ).trim();
                const hs = students.find(
                    (s) =>
                        String(s["mã học sinh"]).trim() === maHS
                );

                if (hs) {
                    ids.push(hs.id);
                }

            });

            console.log("Đã chọn:", ids);

            setSelectedStudents(ids);

        };

        reader.readAsArrayBuffer(file);

    }
    async function importExcel() {

        if (excelData.length === 0) {
            alert("Chưa chọn file Excel.");
            return;
        }

        let success = 0;

        let duplicated = 0;

        let notFound = 0;

        let errors = [];

        for (const row of excelData) {
            const maHS = String(
                row["Mã học sinh"] ||
                row["mã học sinh"] ||
                ""
            ).trim();
          let ngay = row["Ngày"] || row["ngày"];

// Nếu Excel trả về số serial
if (typeof ngay === "number") {
    ngay = XLSX.SSF.format("yyyy-mm-dd", ngay);
}

// Nếu là chuỗi kiểu dd/mm/yyyy
if (typeof ngay === "string" && ngay.includes("/")) {
    const parts = ngay.split("/");
    if (parts.length === 3) {
        ngay =
            parts[2] +
            "-" +
            parts[1].padStart(2, "0") +
            "-" +
            parts[0].padStart(2, "0");
    }
}
            const loai = row["Loại"] || row["loại"];
            const noiDung = row["Nội dung"] || row["nội dung"];

            const daTonTai = behaviors.find(
                (b) =>
                    String(b["mã học sinh"]) === String(maHS) &&
                    String(b["ngày"]) === String(ngay) &&
                    String(b["loại"]) === String(loai) &&
                    String(b["nội dung"]) === String(noiDung)
            );

            if (daTonTai) {

                duplicated++;

                console.log("Bỏ qua:", maHS);

                continue;

            }
            console.log("Dòng Excel:", row);

            console.log("Mã HS:", maHS);

            
            if (!hs) {

                notFound++;

                errors.push(maHS);

                continue;

            }

            await addBehavior({

                studentId: hs.id,

                "mã học sinh": hs["mã học sinh"],

                "họ và tên": hs["họ và tên"],

                "lớp": hs["lớp"],

                "ngày": ngay,

                "loại":
                    row["Loại"] || row["loại"],

                "nội dung":
                    row["Nội dung"] || row["nội dung"],

                "điểm":
                    row["Điểm"] || row["điểm"],

            });

            success++;

        }

        await loadBehavior();

        alert(

            `IMPORT HOÀN TẤT

✓ Thành công : ${success}

⚠ Đã tồn tại : ${duplicated}

❌ Không tìm thấy : ${notFound}`

        );
        console.log(errors);

    }
    async function themHanhVi() {
        console.log("selectedStudents =", selectedStudents);
        console.log("Số học sinh =", selectedStudents.length);
        if (selectedStudents.length === 0) {
            alert("Chưa chọn học sinh.");
            return;
        }

        if (behaviorDate === "") {
            alert("Chưa chọn ngày.");
            return;
        }

        if (behaviorContent.trim() === "") {
            alert("Chưa nhập nội dung.");
            return;
        }

        for (const studentId of selectedStudents) {

            const hs = students.find(
                (item) => String(item.id) === String(studentId)
            );

            await addBehavior({

                studentId: studentId,

                "mã học sinh": hs["mã học sinh"],

                "họ và tên": hs["họ và tên"],

                "lớp": hs["lớp"],

                "ngày": behaviorDate,

                "loại": behaviorType,

                "nội dung": behaviorContent,

                "điểm": behaviorPoint,

            });

        }

        setSelectedStudents([]);
        setBehaviorDate("");
        setBehaviorType("Khen");
        setBehaviorContent("");
        setBehaviorPoint("");

        await loadBehavior();

        alert("Đã thêm hành vi.");

    }
async function capNhatHanhVi() {

    if (!editingBehaviorId) {
        alert("Không tìm thấy bản ghi cần sửa.");
        return;
    }

    const hs = students.find(
        (s) => String(s.id) === String(selectedStudent)
    );

    if (!hs) {
        alert("Không tìm thấy học sinh.");
        return;
    }

    await updateBehavior(editingBehaviorId, {

        studentId: hs.id,

        "mã học sinh": hs["mã học sinh"],

        "họ và tên": hs["họ và tên"],

        "lớp": hs["lớp"],

        "ngày": behaviorDate,

        "loại": behaviorType,

        "nội dung": behaviorContent,

        "điểm": behaviorPoint

    });

    alert("Đã cập nhật nề nếp.");

    setEditingBehaviorId(null);
    setIsEditingBehavior(false);

    setSelectedStudent("");
    setSelectedStudents([]);

    setBehaviorDate("");
    setBehaviorType("Khen");
    setBehaviorContent("");
    setBehaviorPoint("");

    await loadBehavior();
}

            async function saveCriteria() {

    if (criteriaName.trim() === "") {
        alert("Nhập tên tiêu chí.");
        return;
    }

    const data = {

    "tên tiêu chí": criteriaName,

    "loại": criteriaType,

    "điểm": criteriaPoint,

    
};
    if (editingCriteriaId) {

       await updateCriteria({
    id: editingCriteriaId,
    ...data
});

        alert("Đã cập nhật tiêu chí.");

    } else {

        await addCriteria(data);

        alert("Đã thêm tiêu chí.");

    }

    await loadCriteria();

    setCriteriaName("");

    setCriteriaType("Khen");

    setCriteriaPoint(1);

    setEditingCriteriaId(null);

}
function inPhieuPhuHuynh() {

    console.log("parentStudent =", parentStudent);
    console.log("typeof =", typeof parentStudent);

    if (!parentStudent) {
        alert("Chưa chọn học sinh.");
        return;
    }

    // phần còn lại giữ nguyên

    const hs = students.find(
        x => String(x.id) === String(parentStudent)
    );
console.log("Học sinh:", hs);
console.log("behaviors =", behaviors);
console.log("Behavior đầu tiên =", behaviors[0]);

if (!hs) {
    alert("Không tìm thấy học sinh.");
    return;
}

let list = behaviors.filter(
    x =>
        String(x["mã học sinh"]).trim() ===
        String(hs["mã học sinh"]).trim()
);

console.log("Danh sách:", list);
    if (parentReportType === "month") {

        list = list.filter(
            x => String(x["ngày"]).startsWith(parentMonth)
        );

    } else {

        list = list.filter(
            x =>
                x["ngày"] >= parentWeekStart &&
                x["ngày"] <= parentWeekEnd
        );

    }

    const diemCong = list
        .filter(x => x["loại"] === "Khen")
        .reduce((s, x) => s + Number(x["điểm"] || 0), 0);

    const diemTru = list
        .filter(x => x["loại"] === "Nhắc")
        .reduce((s, x) => s + Number(x["điểm"] || 0), 0);

    const html = `
    <html>

    <head>

    <title>Phiếu phụ huynh</title>

    </head>

    <body style="font-family:Arial;padding:40px;">

    <h2 style="text-align:center">
    PHIẾU NHẬN XÉT NỀ NẾP
    </h2>

    <p><b>Họ tên:</b> ${hs["họ và tên"]}</p>

    <p><b>Lớp:</b> ${hs["lớp"]}</p>

    <hr>

    <table
    border="1"
    cellspacing="0"
    cellpadding="6"
    width="100%"
    >

    <tr>

    <th>Ngày</th>

    <th>Loại</th>

    <th>Nội dung</th>

    <th>Điểm</th>

    </tr>

    ${list.map(x=>`

        <tr>

        <td>${x["ngày"]}</td>

        <td>${x["loại"]}</td>

        <td>${x["nội dung"]}</td>

        <td>${x["điểm"]}</td>

        </tr>

    `).join("")}

    </table>

    <br>

    <h3>Tổng điểm cộng : ${diemCong}</h3>

    <h3>Tổng điểm trừ : ${diemTru}</h3>

    <h3>Điểm cuối : ${diemCong-diemTru}</h3>

    <br><br>

    <div style="text-align:right">

    Giáo viên chủ nhiệm

    <br><br><br>

    (Ký tên)

    </div>

    </body>

    </html>
    `;

    const w = window.open();

    w.document.write(html);

    w.document.close();

    w.print();

} 

function inTatCaPhieuPhuHuynh(){

    let html = `
    <html>

    <head>

    <title>Phiếu phụ huynh</title>

    <style>

    body{
        font-family:Arial;
    }

    .page{
        page-break-after:always;
        padding:40px;
    }

    table{
        width:100%;
        border-collapse:collapse;
    }

    table,th,td{
        border:1px solid black;
    }

    th,td{
        padding:6px;
    }

    </style>

    </head>

    <body>
    `;

    students.forEach((hs)=>{

    let list = behaviors.filter(
        x =>
            String(x["mã học sinh"]).trim() ===
            String(hs["mã học sinh"]).trim()
    );

    if(parentReportType==="month"){

        list=list.filter(
            x=>String(x["ngày"]).startsWith(parentMonth)
        );

    }else{

        list=list.filter(
            x=>
                x["ngày"]>=parentWeekStart &&
                x["ngày"]<=parentWeekEnd
        );

    }

    const diemCong=list
        .filter(x=>x["loại"]==="Khen")
        .reduce((s,x)=>s+Number(x["điểm"]||0),0);

    const diemTru=list
        .filter(x=>x["loại"]==="Nhắc")
        .reduce((s,x)=>s+Number(x["điểm"]||0),0);
       const diemCuoi = 10 + diemCong + diemTru;

let xepLoai = "";

if (diemCuoi >= 12) {

    xepLoai = "Xuất sắc";

} else if (diemCuoi >= 10) {

    xepLoai = "Tốt";

} else if (diemCuoi >= 8) {

    xepLoai = "Khá";

} else if (diemCuoi >= 5) {

    xepLoai = "Đạt";

} else {

    xepLoai = "Cần cố gắng";

}
       
        html += `

    

 <div
class="page"
style="
padding:40px;
font-family:'Times New Roman';
font-size:16px;
">

<div style="text-align:center;line-height:1.6">

<div style="font-size:18px;font-weight:bold">
TRƯỜNG THCS VŨNG TÀU
</div>

<div style="font-size:16px">
Thành phố Hồ Chí Minh
</div>

<br>

<div
style="
font-size:24px;
font-weight:bold;
color:#0b5394;
">
PHIẾU NHẬN XÉT NỀ NẾP HỌC SINH
</div>

<div
style="
font-size:16px;
margin-top:8px;
">

${
parentReportType==="month"
?
`Tháng ${parentMonth}`
:
`Từ ngày ${parentWeekStart} đến ngày ${parentWeekEnd}`
}

</div>

</div>

<hr style="margin:20px 0">

<p><b>Họ tên:</b> ${hs["họ và tên"]}</p>

<p><b>Lớp:</b> ${hs["lớp"]}</p>

<hr>

<table>

<tr>
<th>Ngày</th>
<th>Loại</th>
<th>Nội dung</th>
<th>Điểm</th>
</tr>

${list.map(x=>`

<tr>

<td>${x["ngày"]}</td>

<td>${x["loại"]}</td>

<td>${x["nội dung"]}</td>

<td>${x["điểm"]}</td>

</tr>

`).join("")}

</table>

<br>

<h3>Điểm gốc: 10</h3>

<h3>Điểm cộng: +${diemCong}</h3>

<h3>Điểm trừ: ${diemTru}</h3>

<h3>Điểm cuối: ${diemCuoi}</h3>

<h3 style="color:blue">
Xếp loại: ${xepLoai}
</h3>

</div>
`;

});

    html += `
    </body>

    </html>
    `;

const w = window.open();

w.document.write(html);

w.document.close();

w.print();
}

    function exportExcel() {

        if (reportType === "month" && reportMonth === "") {

            alert("Chọn tháng.");

            return;

        }

        if (reportType === "week" && (weekStart === "" || weekEnd === "")) {

            alert("Chọn khoảng ngày.");

            return;

        }

        const report = [];

        students.forEach((hs) => {
            console.log("Student =", hs);
console.log("HS đang chọn:", hs);
console.log("Mã HS:", hs["mã học sinh"]);

          const list = behaviors.filter((b) => {

    console.log("--------------------");
    console.log("Behavior =", b["mã học sinh"], typeof b["mã học sinh"]);
    console.log("Student  =", hs["mã học sinh"], typeof hs["mã học sinh"]);

    return String(b["mã học sinh"]).trim() === String(hs["mã học sinh"]).trim();

});  
                
            const soKhen = list.filter(
                (x) => x["loại"] === "Khen"
            ).length;

            const soNhac = list.filter(
                (x) => x["loại"] === "Nhắc"
            ).length;

            const diemCong = list
                .filter((x) => x["loại"] === "Khen")
                .reduce(
                    (s, x) => s + Number(x["điểm"] || 0),
                    0
                );

            const diemTru = list
                .filter((x) => x["loại"] === "Nhắc")
                .reduce(
                    (s, x) => s + Number(x["điểm"] || 0),
                    0
                );
              const diemCuoi = 10 + diemCong + diemTru;
              let xepLoai = "";

if (diemCuoi >= 12) {

    xepLoai = "Xuất sắc";

} else if (diemCuoi >= 10) {

    xepLoai = "Tốt";

} else if (diemCuoi >= 8) {

    xepLoai = "Khá";

} else if (diemCuoi >= 5) {

    xepLoai = "Đạt";

} else {

    xepLoai = "Cần cố gắng";

}

            const chiTiet = list
    .map((x) => {

        const dau =
            x["loại"] === "Khen"
                ? "✓ [Khen]"
                : "! [Nhắc]";

        return (
            dau +
            " " +
            x["ngày"] +
            " - " +
            x["nội dung"] +
            " (" +
            x["điểm"] +
            "đ)"
        );

    })
    .join("\n");

            report.push({

                "Mã học sinh": hs["mã học sinh"],

                "Họ và tên": hs["họ và tên"],

                "Lớp": hs["lớp"],

                "Tổ": hs["tổ"] || "Chưa phân tổ",

                "Lượt Khen": soKhen,

                "Lượt Nhắc": soNhac,

                "Điểm cộng": diemCong,

                "Điểm trừ": diemTru,

                "Điểm cuối": diemCong - diemTru,

                "Chi tiết hành vi": chiTiet

            });

        });

        report.sort(
            (a, b) => b["Điểm cuối"] - a["Điểm cuối"]
        );
        const dsTo = [...new Set(report.map(x => x["Tổ"]))];
        // Xếp hạng theo tổ

        const xepHangTo = dsTo.map((to) => {

            const thanhVien = report.filter(
                x => x["Tổ"] === to
            );

            return {

                to,

                diem: thanhVien.reduce(
                    (s, x) => s + x["Điểm cuối"],
                    0
                )

            };

        });

        xepHangTo.sort(
            (a, b) => b.diem - a.diem
        );
        dsTo.forEach((to) => {

            const nhom = report
                .filter(x => x["Tổ"] === to)
                .sort(
                    (a, b) => b["Điểm cuối"] - a["Điểm cuối"]
                );

            nhom.forEach((hs, index) => {

                if (index === 0) {

                    hs["Hạng tổ"] = 1;

                } else {

                    if (hs["Điểm cuối"] === nhom[index - 1]["Điểm cuối"]) {

                        hs["Hạng tổ"] = nhom[index - 1]["Hạng tổ"];

                    } else {

                        hs["Hạng tổ"] = index + 1;

                    }

                }

            });

        });

        report.forEach((hs, index) => {

            if (index === 0) {

                hs["Hạng lớp"] = 1;

            } else {

                if (hs["Điểm cuối"] === report[index - 1]["Điểm cuối"]) {

                    hs["Hạng lớp"] = report[index - 1]["Hạng lớp"];

                } else {

                    hs["Hạng lớp"] = index + 1;

                }

            }

        });

        report.forEach((r, i) => {

            r["STT"] = i + 1;

        });
        //==============================
        // TẠO SHEET 2 - THỐNG KÊ THEO TỔ
        //==============================

        const reportTo = [];

        dsTo.forEach((to) => {

            const thanhVien = report
                .filter(x => x["Tổ"] === to)
                .sort((a, b) => b["Điểm cuối"] - a["Điểm cuối"]);

            const tongKhen = thanhVien.reduce(
                (s, x) => s + x["Lượt Khen"], 0
            );

            const tongNhac = thanhVien.reduce(
                (s, x) => s + x["Lượt Nhắc"], 0
            );

            const tongCong = thanhVien.reduce(
                (s, x) => s + x["Điểm cộng"], 0
            );

            const tongTru = thanhVien.reduce(
                (s, x) => s + x["Điểm trừ"], 0
            );

            const tongCuoi = thanhVien.reduce(
                (s, x) => s + x["Điểm cuối"], 0
            );

            const hangTo =
                xepHangTo.findIndex(
                    x => x.to === to
                ) + 1;

            reportTo.push({

                "TỔ": "============================"

            });

            reportTo.push({

                "TỔ": "TỔ " + to

            });

            reportTo.push({

                "TỔ": "============================"

            });

            reportTo.push({});

            reportTo.push({

                "TỔ": "Tổng lượt khen",

                "Khen": tongKhen

            });

            reportTo.push({

                "TỔ": "Tổng lượt nhắc",

                "Khen": tongNhac

            });

            reportTo.push({

                "TỔ": "Tổng điểm cộng",

                "Khen": tongCong

            });

            reportTo.push({

                "TỔ": "Tổng điểm trừ",

                "Khen": tongTru

            });

            reportTo.push({

                "TỔ": "Điểm cuối",

                "Khen": tongCuoi

            });

            reportTo.push({

                "TỔ": "Xếp hạng tổ",

                "Khen": hangTo

            });

            reportTo.push({});

            reportTo.push({

                "Hạng trong tổ": "HẠNG",

                "Họ và tên": "HỌ VÀ TÊN",

                "Lượt Khen": "KHEN",

                "Lượt Nhắc": "NHẮC",

                "Điểm cộng": "ĐIỂM +",

                "Điểm trừ": "ĐIỂM -",

                "Điểm cuối": "ĐIỂM CUỐI"

            });
            thanhVien.forEach((hs) => {

                reportTo.push({

                    "Hạng trong tổ": hs["Hạng tổ"],

                    "Họ và tên": hs["Họ và tên"],

                    "Lượt Khen": hs["Lượt Khen"],

                    "Lượt Nhắc": hs["Lượt Nhắc"],

                    "Điểm cộng": hs["Điểm cộng"],

                    "Điểm trừ": hs["Điểm trừ"],

                    "Điểm cuối": hs["Điểm cuối"]

                });

            });
            reportTo.push({});
            reportTo.push({});

        });   // <-- đóng dsTo.forEach ở đây

        const ws = XLSX.utils.json_to_sheet(report, {
            origin: "A3"
        });
        let title = "";

        if (reportType === "month") {

            title = "BÁO CÁO THÁNG " + reportMonth;

        } else {

            title =
                "BÁO CÁO TUẦN " +
                weekStart +
                " ĐẾN " +
                weekEnd;

        }

        XLSX.utils.sheet_add_aoa(
            ws,
            [[title]],
            { origin: "A1" }
        );
        const wsTo = XLSX.utils.json_to_sheet(reportTo);
        // Gộp ô tiêu đề A1 đến K1
        ws["!merges"] = [
            {
                s: { r: 0, c: 0 },
                e: { r: 0, c: 10 }
            }
        ];

        // Định dạng tiêu đề
        ws["A1"].s = {

            font: {
                bold: true,
                sz: 18,
                color: { rgb: "FFFFFF" }
            },

            fill: {
                fgColor: { rgb: "1F4E78" }
            },

            alignment: {
                horizontal: "center",
                vertical: "center"
            }

        };
        // Độ rộng cột Sheet BaoCao
        ws["!cols"] = [
            { wch: 6 },
            { wch: 15 },
            { wch: 28 },
            { wch: 10 },
            { wch: 10 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 10 },
            { wch: 60 }
        ];
        // Độ rộng cột Sheet ThongKeTo
        wsTo["!cols"] = [
            { wch: 22 },
            { wch: 10 },
            { wch: 10 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 10 },
            { wch: 12 },
            { wch: 30 },
            { wch: 12 },
            { wch: 12 }
        ];
        function styleHeader(sheet) {

            const range = XLSX.utils.decode_range(sheet["!ref"]);

            for (let c = range.s.c; c <= range.e.c; c++) {

                const cell =
                    XLSX.utils.encode_cell({
                        r: 0,
                        c: c
                    });

                if (sheet[cell]) {

                    sheet[cell].s = {

                        font: {
                            bold: true,
                            color: { rgb: "FFFFFF" }
                        },

                        fill: {
                            fgColor: { rgb: "1F4E78" }
                        },

                        alignment: {
                            horizontal: "center",
                            vertical: "center"
                        },

                        border: {
                            top: { style: "thin" },
                            bottom: { style: "thin" },
                            left: { style: "thin" },
                            right: { style: "thin" }
                        }

                    };

                }

            }

        }
        styleHeader(ws);
        styleHeader(wsTo);
        // Định dạng cột Chi tiết hành vi
        const range = XLSX.utils.decode_range(ws["!ref"]);

        for (let r = 3; r <= range.e.r; r++) {

            const cell = "L" + (r + 1);

            if (!ws[cell]) continue;

            ws[cell].s = {

                alignment: {
                    vertical: "top",
                    horizontal: "left",
                    wrapText: true
                },

                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }

            };

        }
        // Tô màu Top 1 - Top 3
        for (let i = 3; i <= report.length + 2; i++) {

            const cell = "J" + i;

            if (!ws[cell]) continue;

            const hang = Number(ws[cell].v);

            if (hang === 1) {

                ws[cell].s = {
                    fill: {
                        fgColor: { rgb: "FFD700" }   // Vàng
                    },
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center"
                    }
                };

            } else if (hang === 2) {

                ws[cell].s = {
                    fill: {
                        fgColor: { rgb: "C0C0C0" }   // Bạc
                    },
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center"
                    }
                };

            } else if (hang === 3) {

                ws[cell].s = {
                    fill: {
                        fgColor: { rgb: "CD7F32" }   // Đồng
                    },
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center"
                    }
                };

            }

        }
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "BaoCao"
        );

        XLSX.utils.book_append_sheet(
            wb,
            wsTo,
            "ThongKeTo"
        );

        const excelBuffer = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        let fileName = "";

        if (reportType === "month") {

            fileName = `BaoCao_Thang_${reportMonth}.xlsx`;

        } else {

            fileName = `BaoCao_Tuan_${weekStart}_${weekEnd}.xlsx`;

        }

        saveAs(file, fileName);

    }
    
    return (
        <div style={{ padding: "30px" }}>

            <h1>Nề nếp & Hành vi</h1>
            <button
    style={{
        marginBottom: "20px",
        background: "#1976d2",
        color: "white",
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }}
    onClick={() => setShowCriteria(true)}
>
    ⚙ Quản lý tiêu chí
</button>
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px",
                    background: "#fafafa",
                }}
            >

                {/* Hàng 1 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginBottom: "15px",
                    }}
                >

                    <input
                        type="text"
                        placeholder="🔍 Tìm học sinh..."
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        style={{
                            width: "300px",
                            marginBottom: "10px",
                        }}
                    />

                    <div
                        style={{
                            border: "1px solid #ccc",
                            height: "180px",
                            overflowY: "auto",
                            padding: "10px",
                            width: "320px",
                        }}
                    >
                        {students
                            .filter((hs) =>
                                hs["họ và tên"]
                                    .toLowerCase()
                                    .includes(searchStudent.toLowerCase())
                            )
                            .map((hs) => (
                                <div key={hs.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(hs.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedStudents([
                                                        ...selectedStudents,
                                                        hs.id,
                                                    ]);
                                                } else {
                                                    setSelectedStudents(
                                                        selectedStudents.filter(
                                                            (id) => id !== hs.id
                                                        )
                                                    );
                                                }
                                            }}
                                        />

                                        {" "}

                                        {hs["họ và tên"]}

                                        {" - "}

                                        {hs["lớp"]}
                                    </label>
                                </div>
                            ))}
                    </div>

                    <div>

                        <b>Lớp:</b>{" "}

                        {selectedStudentInfo
                            ? selectedStudentInfo["lớp"]
                            : ""}

                    </div>

                    <div>

                        <b>Mã HS:</b>{" "}

                        {selectedStudentInfo
                            ? selectedStudentInfo["mã học sinh"]
                            : ""}

                    </div>

                </div>

                {/* Hàng 2 */}

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "15px",
                    }}
                >

                    <input
                        type="date"
                        value={behaviorDate}
                        onChange={(e) => setBehaviorDate(e.target.value)}
                    />

                                                          
                </div>

                {/* Hàng 3 */}

                  <div style={{ marginBottom: "15px" }}>

<select
    value={behaviorContent}
    onChange={(e) => {

        const value = e.target.value;

        setBehaviorContent(value);

        const tc = criteria.find(
    (x) => x["tên tiêu chí"] === value
);

if (tc) {

    setBehaviorType(tc["loại"]);

    setBehaviorPoint(Number(tc["điểm"]));

}
    }}
    style={{
        width: "100%",
        padding: "8px"
    }}
>

    <option value="">
        -- Chọn tiêu chí --
    </option>

    {criteria.map((item) => (

    <option
    key={item.id}
    value={item["tên tiêu chí"]}
>
    {item["loại"]} | {item["tên tiêu chí"]} | {item["điểm"]} điểm
</option>

))}
</select>

</div>
<button
    onClick={
        isEditingBehavior
            ? capNhatHanhVi
            : themHanhVi
    }
>

    {isEditingBehavior
        ? "Cập nhật"
        : "Thêm"}

</button>                                {/* Hàng 4 */}
                <div style={{ marginBottom: "20px" }}>

                    <h3>Import từ Excel</h3>

                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setExcelFile(file);
                            docFileExcel(file);
                        }}
                    />

                    <button
                        style={{ marginLeft: "15px" }}
                        onClick={importExcel}
                    >
                        Import Excel
                    </button>

                </div>

                
                </div>
            <hr />

            <h2>Xuất báo cáo</h2>

            <div style={{ marginBottom: "20px" }}>
                <select

                    value={reportType} onChange={(e) => setReportType(e.target.value)}
                    style={{ marginRight: "15px" }}
                >
                    <option value="month">Báo cáo tháng</option>
                    <option value="week">Báo cáo tuần</option>
                </select>
                {reportType === "month" && (
                    <input
                        type="month"
                        value={reportMonth}
                        onChange={(e) => setReportMonth(e.target.value)}
                        style={{ marginLeft: "15px" }}
                    />
                )}

                {
                    reportType === "week" && (

                        <>

                            <input
                                type="date"
                                value={weekStart}
                                onChange={(e) => setWeekStart(e.target.value)}
                                style={{ marginLeft: "15px" }}
                            />

                            <span style={{ margin: "0 10px" }}>
                                đến
                            </span>

                            <input
                                type="date"
                                value={weekEnd}
                                onChange={(e) => setWeekEnd(e.target.value)}
                            />

                        </>

                    )
                }

                <button
                    style={{ marginLeft: "15px" }}
                    onClick={exportExcel}
                >
                    Xuất Excel
                </button>

            </div>
            <hr />

<h2>📄 Phiếu gửi phụ huynh</h2>

<div
    style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        background: "#fafafa",
    }}
>

<div style={{ marginBottom: "10px" }}>

<select
    value={parentReportType}
    onChange={(e)=>setParentReportType(e.target.value)}
>

<option value="week">
Theo tuần
</option>

<option value="month">
Theo tháng
</option>

</select>

</div>

{
parentReportType==="month"
?

<input
type="month"
value={parentMonth}
onChange={(e)=>setParentMonth(e.target.value)}
/>

:

<div>

<input
type="date"
value={parentWeekStart}
onChange={(e)=>setParentWeekStart(e.target.value)}
/>

<span
style={{margin:"0 10px"}}
>
đến
</span>

<input
type="date"
value={parentWeekEnd}
onChange={(e)=>setParentWeekEnd(e.target.value)}
/>

</div>

}

<div style={{marginTop:"15px"}}>

<select
    style={{ width: "350px" }}
    value={parentStudent}
    onChange={(e) => {
        console.log("Đã chọn:", e.target.value);
        setParentStudent(e.target.value);
    }}
>
<option value="">
-- Chọn học sinh --
</option>

{
students.map((hs)=>(

<option
key={hs.id}
value={hs.id}
>

{hs["họ và tên"]} - {hs["lớp"]}

</option>

))
}

</select>
<p>Đã chọn: {parentStudent}</p>
<button
    style={{
        marginLeft: "15px",
        background: "#1976d2",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        cursor: "pointer"
    }}
    onClick={inPhieuPhuHuynh}
>
    🖨 In phiếu
</button>
<button
    style={{
        marginLeft: "10px",
        background: "#28a745",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        cursor: "pointer"
    }}
    onClick={inTatCaPhieuPhuHuynh}
>
    🖨 In cả lớp
</button>
</div>

</div>
            <table border="1" cellPadding="10">

                <thead>
<tr>

<th>ID</th>
<th>Ngày</th>
<th>Họ tên</th>
<th>Lớp</th>
<th>Loại</th>
<th>Nội dung</th>
<th>Điểm</th>

</tr>
</thead>
                <tbody>
                    {behaviors.map((item, index) => (
                        <tr key={item.recordid || item.studentid + "-" + item["ngày"]}>
                            <td>{item.recordid}</td>
                            <td>{item["ngày"]}</td>
                            <td>{item["họ và tên"]}</td>
                            <td>{item["lớp"]}</td>
                            <td>{item["loại"]}</td>
                            <td>{item["nội dung"]}</td>
                            <td>{item["điểm"]}</td>
                            <td>

    <button
        onClick={() => suaNeNep(item)}
    >
        Sửa
    </button>

    <button
        style={{ marginLeft: "8px" }}
onClick={() => xoaNeNep(item.recordid)} 
    >
        Xóa
    </button>

</td>
                        </tr>
                    ))}
                </tbody>

            </table>
                        
  {showCriteria && (

<div
    style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
    }}
>

<div
    style={{
        background: "#fff",
        width: "900px",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "20px",
        borderRadius: "10px"
    }}
>

<h2 style={{textAlign:"center"}}>
    Quản lý tiêu chí
</h2>

<div
style={{
display:"flex",
gap:"10px",
marginBottom:"15px",
flexWrap:"wrap"
}}
>

<input
value={criteriaName}
onChange={(e)=>setCriteriaName(e.target.value)}
placeholder="Tên tiêu chí"
style={{width:"220px"}}
/>

<select
value={criteriaType}
onChange={(e)=>setCriteriaType(e.target.value)}
style={{width:"120px"}}
>

<option value="Khen">
Khen
</option>

<option value="Nhắc">
Nhắc
</option>

</select>

<input
type="number"
value={criteriaPoint}
onChange={(e)=>setCriteriaPoint(Number(e.target.value))}
placeholder="Điểm"
style={{width:"90px"}}
/>

<button
onClick={saveCriteria}
style={{
background:"#28a745",
color:"white",
border:"none",
padding:"8px 15px",
borderRadius:"5px",
cursor:"pointer"
}}
>

{editingCriteriaId ? "Cập nhật" : "Lưu"}

</button>

</div>

<table
border="1"
cellPadding="8"
style={{
width:"100%",
borderCollapse:"collapse"
}}
>

<thead>

<tr>

<th>ID</th>

<th>Tên tiêu chí</th>

<th>Loại</th>

<th>Điểm</th>

<th width="160">
Thao tác
</th>

</tr>

</thead>

<tbody>

{

criteria.map((c)=>(

<tr key={c.id}>

<td>{c.id}</td>

<td>{c["tên tiêu chí"]}</td>

<td>{c["loại"]}</td>

<td>{c["điểm"]}</td>

<td>

<button

onClick={() => {

    setEditingCriteriaId(c.id);

    setCriteriaName(c["tên tiêu chí"]);

    setCriteriaType(c["loại"]);

    setCriteriaPoint(c["điểm"]);

  
}}
>

Sửa

</button>

<button

style={{marginLeft:"8px"}}

onClick={async()=>{

if(!window.confirm("Xóa tiêu chí này?")) return;

await deleteCriteria(c.id);

await loadCriteria();

}}

>

Xóa

</button>

</td>

</tr>

))

}

</tbody>

</table>

<div
style={{
marginTop:"20px",
textAlign:"center"
}}
>

<button

onClick={()=>{

setShowCriteria(false);

setEditingCriteriaId(null);

setCriteriaName("");

setCriteriaType("Khen");

setCriteriaPoint(1);

}}

>

Đóng

</button>

</div>

</div>

</div>

)}

</div>
);

}
export default Behavior;

