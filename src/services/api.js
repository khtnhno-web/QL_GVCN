const API_URL =
"https://script.google.com/macros/s/AKfycbxDHDwoUubX19ItOjXBAi30PYTUTf3yq1wH4m7cCj9Meq2IqhRpDBiuLKukciGf3p_hqA/exec";

export async function getStudents() {

  const response = await fetch(API_URL + "?resource=students");

  const data = await response.json();

  return data;

}
export async function addStudent(student) {

  const res = await fetch(API_URL, {
    method: "POST",
    
    body: JSON.stringify({
      action: "add",
      resource: "students",
      payload: student,
    }),
  });

  const data = await res.text();

  console.log(data);

  return data;

}
export async function updateStudent(student) {

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "update",
      resource: "students",
      id: student.id,
      payload: student,
    }),
  });

 const data = await res.text();

console.log(data);

return data;
}
export async function deleteStudent(id) {

  const res = await fetch(API_URL, {
    method: "POST",

    body: JSON.stringify({
      action: "remove",
      resource: "students",
      id: id,
    }),
  });

  const data = await res.text();

  console.log(data);

  return data;
}
export async function deleteBehavior(id) {

    console.log("Đang xóa ID:", id);

    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "remove",
            resource: "behavior",
            id: id,
        }),
    });

    const data = await res.text();

    console.log("API trả về:", data);

    return data;
}
export async function getBehavior() {

  const response = await fetch(API_URL + "?resource=behavior");

  const data = await response.json();

  return data;

}
export async function addBehavior(item) {

  const res = await fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

      action: "add",

      resource: "behavior",

      payload: item,

    }),

  });

  const data = await res.text();

  console.log(data);

  return data;

}
export async function updateBehavior(id, item) {

  const res = await fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

      action: "update",

      resource: "behavior",

      id: id,

      payload: item,

    }),

  });

  const data = await res.text();

  console.log(data);

  return data;

}

// =========================
// CRITERIA
// =========================

export async function getCriteria() {

  const response = await fetch(API_URL + "?resource=criteria");

  const data = await response.json();

  return data;

}

export async function addCriteria(item) {

  const res = await fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

      action: "add",

      resource: "criteria",

      payload: item,

    }),

  });

  const data = await res.text();

  console.log(data);

  return data;

}

export async function updateCriteria(id, item) {

  const res = await fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

      action: "update",

      resource: "criteria",

      id: id,

      payload: item,

    }),

  });

  const data = await res.text();

  console.log(data);

  return data;

}
export async function deleteCriteria(id) {

  const res = await fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

      action: "remove",

      resource: "criteria",

      id: id,

    }),

  });

  const data = await res.text();

  console.log(data);

  return data;

}