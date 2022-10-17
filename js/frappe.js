import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const submitButton = document.getElementById("submit-data");

let clicked = "false";
let mun = "Whole country";

//Help from course sourcecodes
const jsonQuery = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"]
      }
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getData = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonQuery)
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();

  console.log(data);

  return data;
};

const buildChart = async (check, name) => {
  if (name === "") {
    name = "Whole country";
  }

  if (check === "true") {
    const mData = await getMunicipality();

    let nameArr = Object.values(mData.variables[1])[3];
    let idArr = Object.values(mData.variables[1])[2];
    let area;

    for (let i = 0; i < 310; i++) {
      if (nameArr[i].toLowerCase() === name.toLowerCase()) {
        area = idArr[i];
        name = nameArr[i];
      }
    }
    //jsonQuery.query[1].selection.values.shift();
    //jsonQuery.query[1].selection.values.push(area);
    jsonQuery.query[1].selection.values[0] = area;
  }

  console.log(jsonQuery);

  const data = await getData();

  const year = Object.values(data.dimension.Vuosi.category.label);
  const info = Object.values(data.value);

  const chartData = {
    labels: year,
    datasets: [{ values: info }]
  };

  const chart = new Chart("#chart", {
    title: name,
    data: chartData,
    type: "line",
    height: 450,
    colors: ["#eb5146"]
  });
};

async function getMunicipality() {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "GET"
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();

  console.log(data);
  return data;
}

buildChart(clicked, mun);

submitButton.addEventListener("click", function (event) {
  mun = document.getElementById("input-area").value;
  clicked = "true";
  buildChart(clicked, mun);
  event.preventDefault();
});
