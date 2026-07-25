import { useState } from "react";

import Students from "./pages/Students";
import Behavior from "./pages/Behavior";
import Report from "./pages/Report";
import Criteria from "./pages/Criteria";

function Home() {

    const [page, setPage] = useState("students");

    return (

        <div>

            {/* Thanh tiêu đề */}

            <div
                style={{
                    background: "#1565c0",
                    color: "white",
                    padding: "18px",
                    fontSize: "28px",
                    fontWeight: "bold",
                    textAlign: "center"
                }}
            >
                PHẦN MỀM QUẢN LÝ LỚP CHỦ NHIỆM
            </div>

            {/* Menu */}

            <div
                style={{
                    display: "flex",
                    background: "#1976d2",
                    padding: "10px",
                    gap: "10px"
                }}
            >

                <button onClick={() => setPage("students")}>
                    🏠 Học sinh
                </button>

                <button onClick={() => setPage("behavior")}>
                    📝 Nề nếp
                </button>

                
            </div>

            {/* Nội dung */}

            <div style={{ padding: 20 }}>

                {page === "students" && <Students />}

{page === "behavior" && <Behavior />}

            </div>

        </div>

    );

}

export default Home;
