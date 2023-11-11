function myMenuFunction() {
    var i = document.getElementById("navMenu");

    if(i.className === "nav-menu"){
        i.className += " responsive";
    }else{ 
        i.className = "nav-menu";
    }
}

const activePage = window.location.href;
    const navLinks = document.querySelectorAll('ul li a.link');
    navLinks.forEach(element => {
        if (element.href==activePage) {
            element.classList.add('active');
        }
    });


    document.addEventListener("DOMContentLoaded", function () {
        // Get a reference to the input element
        const surgeryDateInput = document.getElementById("surgeryDate");
      
        // Create a JavaScript Date object for the current date
        const currentDate = new Date();
      
        // Format the current date to YYYY-MM-DD for the max attribute
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
      
        // Set the max attribute to the formatted current date
        surgeryDateInput.setAttribute("max", formattedDate);
      });

  

      
      const cookies = document.cookie; // Get all cookies as a single string

      // To access a specific cookie by name, you can create a function like this:
      function getCookie(name) {
        const cookieArray = cookies.split('; ');
        for (const cookie of cookieArray) {
          const [cookieName, cookieValue] = cookie.split('=');
          if (cookieName === name) {
            return decodeURIComponent(cookieValue);
          }
        }
        return null; // Return null if the cookie with the specified name is not found
      }

      const exceed = parseInt(getCookie('countExceed'),10);
      const onTime = parseInt(getCookie('countOnTime'),10);
      const jan = parseInt(getCookie('getJan'),10);
      const fab = parseInt(getCookie('getFab'),10);
      const mar = parseInt(getCookie('getMar'),10);
      const apr = parseInt(getCookie('getApr'),10);
      const may = parseInt(getCookie('getMay'),10);
      const jun = parseInt(getCookie('getJun'),10);
      const jul = parseInt(getCookie('getJul'),10);
      const aug = parseInt(getCookie('getAug'),10);
      const sep = parseInt(getCookie('getSep'),10);
      const oct = parseInt(getCookie('getOct'),10);
      const nov = parseInt(getCookie('getNov'),10);
      const dec = parseInt(getCookie('getDec'),10);
      const type1 = parseInt(getCookie('gettype1'),10);
      const type2 = parseInt(getCookie('gettype2'),10);
      const type3 = parseInt(getCookie('gettype3'),10);
      const type4 = parseInt(getCookie('gettype4'),10);
      const type5 = parseInt(getCookie('gettype5'),10);
      const jan1 = parseInt(getCookie('getJan1'),10);
      const fab1 = parseInt(getCookie('getFab1'),10);
      const mar1 = parseInt(getCookie('getMar1'),10);
      const apr1 = parseInt(getCookie('getApr1'),10);
      const may1 = parseInt(getCookie('getMay1'),10);
      const jun1 = parseInt(getCookie('getJun1'),10);
      const jul1 = parseInt(getCookie('getJul1'),10);
      const aug1 = parseInt(getCookie('getAug1'),10);
      const sep1 = parseInt(getCookie('getSep1'),10);
      const oct1 = parseInt(getCookie('getOct1'),10);
      const nov1 = parseInt(getCookie('getNov1'),10);
      const dec1 = parseInt(getCookie('getDec1'),10);



      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart1);
      function drawChart1() {
        var data = google.visualization.arrayToDataTable([
          ['Surgeries Time', 'Number Of Surgeries'],
          ['Exceed',     exceed],
          ['On Time',      onTime],
        ]);
        var options = {
          title: 'My Surgeries Durations',
          colors: ['lightcoral', 'mediumseagreen'], // Set custom colors here
        };
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
      }

      

      google.charts.load('current', { packages: ['corechart', 'bar'] });
      google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {

// Create a data table
var data = new google.visualization.DataTable();
data.addColumn('date', 'Month');
data.addColumn('number', 'Lead Surgeries');

data.addRows([
  [new Date(2023, 0, 1), jan],
  [new Date(2023, 1, 1), fab],
  [new Date(2023, 2, 1), mar],
  [new Date(2023, 3, 1), apr],
  [new Date(2023, 4, 1), may],
  [new Date(2023, 5, 1), jun],
  [new Date(2023, 6, 1), jul],
  [new Date(2023, 7, 1), aug],
  [new Date(2023, 8, 1), sep],
  [new Date(2023, 9, 1), oct],
  [new Date(2023, 10, 1), nov],
  [new Date(2023, 11, 1), dec],
]);

var options = {
    title: 'Lead Surgeries Per Month',
    hAxis: {
      title: 'Month',
      format: 'MMM',
    },
    vAxis: {
      title: 'Number of Surgeries',
    },
    colors: ['salmon'],
  };
  
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


google.charts.load('current', { packages: ['corechart', 'bar'] });
google.charts.setOnLoadCallback(drawBasic2);

function drawBasic2() {
  // Create a data table
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'surgery Type');
  data.addColumn('number', 'Lead Surgeries');

  data.addRows([
    ["Coronary Artery Bypass Grafting (CABG)", type1],
    ["Valve Replacement Surgery", type2],
    ["Atrial Septal Defect (ASD) Closure", type3],
    ["Ventricular Septal Defect (VSD) Repair", type4],
    ["Heart Transplantation", type5],
  ]);

  var options = {
    title: 'Number Of Surgeries For Each Type',
    hAxis: {
      title: 'Type',
      format: 'string',
    },
    vAxis: {
      title: 'Number of Surgeries',
    },
    colors: ['cadetblue'],
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
  chart.draw(data, options);
}




      google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart2);

function drawChart2() {
  var data = google.visualization.arrayToDataTable([
    ['Month', 'Satisfaction'],
    ['Jan',  jan1],
    ['Fab',  fab1],
    ['Mar',  mar1],
    ['Apr',  apr1],
    ['May',  may1],
    ['Jun',  jun1],
    ['Jul',  jul1],
    ['Aug',  aug1],
    ['Sep',  sep1],
    ['Oct',  oct1],
    ['Nov',  nov1],
    ['Dec',  dec1]
  ]);

  var options = {
    title: 'Patients Satisfaction',
    curveType: 'function',
    legend: { position: 'bottom' },
    colors: ['hotpink'],
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart3'));

  chart.draw(data, options);
}