function allInOne(dataApiCurrent, dataApiChart, dataApiHistory) {

  //get date to day
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var today = `${day}/${month}`;
  
  for(var props in dataApiChart) {
    var position1 = dataApiChart[props][2].indexOf('(');
    var position2 = dataApiChart[props][2].indexOf(')');
    var getDateChart = dataApiChart[props][2].slice(position1 + 1,position2);
    if (getDateChart == today) {
      dataApiChart[props][2] = `Hôm nay (${getDateChart})` //change var dateChart
    }
  }
      

  //script inner HTML
  var renderHtml = function () {
    document.querySelector("#today_container").innerHTML = `
    <div class="today_location-container">
        <div class="today_location-header">
          <div class="today_location-name">
            ${dataApiCurrent.locationCurrent}
          </div>
          <div class="today_location-date">
           ${day}/${month}/${year}
          </div>
        </div>
      </div>
  
      <div class="today_temp-container row">
        <div class="today_temp-main col-8">
          <div class="temp_main">
            ${dataApiCurrent.tempCurrent}°
          </div>
          <div class="current_status">
            ${dataApiCurrent.weatherCurrent}
          </div>
          <div class="day-night_temp">
            Ngày ${dataApiCurrent.tempDay}° <span class="dot_temp">.</span> Đêm ${dataApiCurrent.tempNight}°
          </div>
        </div>
        <div class="today_temp-icon col-4">
        <img class="icon_forecast" src="" alt="icon_forecast">
      </div>
      </div>
    `;
  
    document.querySelector(".temp_content").innerHTML = `${dataApiCurrent.feelTempCurrent}°`;
    document.querySelector(".time_sun_container").innerHTML = `
      <span class="icon_sunrise">
        <i class="fa-solid fa-arrow-up-from-bracket yellow_color"></i>
      </span>
      <span class="time_sun">${dataApiCurrent.timeSunrise}</span>
      <span class="icon_sundown">
        <i class="fa-solid fa-arrow-right-to-bracket transform_down yellow_color"></i>
      </span>
      <span class="time_sun margin_left_icon">${dataApiCurrent.timeSunset}</span>
    `;
    if (dataApiCurrent.sunCurrent < 0) {
      document.querySelector('.dot').style.display = "none";
    }
    else {
      document.querySelector(".percent").innerHTML = `
        <div class="percent" style="--clr:#e87538; --num:${dataApiCurrent.sunCurrent};">
          <div class="dot">
            <i class="fa-solid fa-sun sun"></i>
          </div>
          <svg>
            <circle cx="70" cy="70" r="70"></circle>
            <circle cx="70" cy="70" r="70"></circle>
          </svg>
        </div>
      `
    }

    //direction wind
    var renderDirection = function() {
      var arrContainerDeg = [0,90,180,270,360];
      var arrContainerDirection = ['Bắc','Đông','Nam','Tây','Bắc'];
      for (var i = 0; i < arrContainerDeg.length ; i++) {
        if (dataApiCurrent.detailsCurrent[4] == arrContainerDeg[i]) {
          dataApiCurrent.detailsCurrent[4] = arrContainerDirection[i];
        }
      }
      if(dataApiCurrent.detailsCurrent[4]>0 && dataApiCurrent.detailsCurrent[4]<90) {
        dataApiCurrent.detailsCurrent[4] = 'Đông Bắc';
      }
      if(dataApiCurrent.detailsCurrent[4]>90 && dataApiCurrent.detailsCurrent[4]<180) {
        dataApiCurrent.detailsCurrent[4] = 'Đông Nam';
      }
      if(dataApiCurrent.detailsCurrent[4]>180 && dataApiCurrent.detailsCurrent[4]<270) {
        dataApiCurrent.detailsCurrent[4] = 'Tây Nam';
      }
      if(dataApiCurrent.detailsCurrent[4]>270 && dataApiCurrent.detailsCurrent[4]<360) {
        dataApiCurrent.detailsCurrent[4] = 'Tây Bắc';
      }
      
      //render dataApiCurrent on screen todayDetails
      var dataContainer = document.querySelectorAll(".items_right > span");
      var dataApiContainer = dataApiCurrent.detailsCurrent;
        for (var i = 0; i < dataApiContainer.length ; i++) {
            dataContainer[i].innerText = `${dataApiContainer[i]}`;
        }
    }
    renderDirection();

  };
  renderHtml();

  //script change icon and theme
  var themeChange = function () {
    var changeImage = document.querySelector(".icon_forecast");
    if (dataApiCurrent.sunCurrent == -1) {
      document.querySelector(":root").style.setProperty("--backgroundTheme", "#022d50");
      document.querySelector(":root").style.setProperty("--backgroundHeader", "#355773");
      document.querySelector("#today_container").style.backgroundImage = "url('./Assets/Img/cloud/night_sky.jpg')";
      changeImage.src = "./Assets/Img/icon_forecast/night_moon.png";
      // changeImage.src = "./Assets/Img/icon_forecast/rain.png";
    } else {
        var containerCodeSunny = [1000,1003,1006];
          for (var i = 0; i < containerCodeSunny.length; i++) {
            if (dataApiCurrent.themeCurrent == containerCodeSunny[i]) {
              changeImage.src = "./Assets/Img/icon_forecast/sunny_cloud.png";
              document.querySelector(":root").style.setProperty("--backgroundTheme", "#005986");
              document.querySelector(":root").style.setProperty("--backgroundHeader", "#337a9e");
              }
          }
        var containerCodeRain = [1063,1183,1180,1189,1198,1273,1276,1240];
          for(var i = 0; i < containerCodeRain.length; i++) {
            if (dataApiCurrent.themeCurrent == containerCodeRain[i]) {
              changeImage.src = "./Assets/Img/icon_forecast/rain.png";
              document.querySelector(":root").style.setProperty("--backgroundTheme", "#59516e");
              document.querySelector(":root").style.setProperty("--backgroundHeader", "#7A748B");
            }
          }
      }
  };
  themeChange();


  //script render Chart JS
  var renderChart = function() {
    var chart = new CanvasJS.Chart("chartContainer", {
      title: {
        text: "Dự báo thời tiết hàng ngày",
        fontFamily: "arial",
        padding: 16,
      },
      axisY: {
        suffix: " °C",
        maximum: 50,
        gridThickness: 0,
      },
      toolTip: {
        shared: true,
        content:
          "{name} </br> <strong>Nhiệt độ: </strong> </br> Đêm: {y[0]} °C, Ngày: {y[1]} °C",
      },
      data: [
        {
          type: "rangeSplineArea",
          fillOpacity: 0.1,
          highlightEnabled: true,
          color: "#91AAB1",
          indexLabelFormatter: formatter,
          dataPoints: [
            {
              label: dataApiChart.monday[2],
              y: [dataApiChart.monday[0], dataApiChart.monday[1]],
              name: dataApiChart.monday[3],
              linkCdn: dataApiChart.monday[4],
            },
            {
              label: dataApiChart.tuesday[2],
              y: [dataApiChart.tuesday[0], dataApiChart.tuesday[1]],
              name: dataApiChart.tuesday[3],
              linkCdn: dataApiChart.tuesday[4],
            },
            {
              label: dataApiChart.wednesday[2],
              y: [ dataApiChart.wednesday[0],  dataApiChart.wednesday[1]],
              name: dataApiChart.wednesday[3],
              linkCdn: dataApiChart.wednesday[4],
            },
            {
              label:  dataApiChart.thursday[2],
              y: [ dataApiChart.thursday[0],  dataApiChart.thursday[1]],
              name: dataApiChart.thursday[3],
              linkCdn: dataApiChart.thursday[4],
            },
            {
              label: dataApiChart.friday[2],
              y: [dataApiChart.friday[0], dataApiChart.friday[1]],
              name: dataApiChart.friday[3],
              linkCdn: dataApiChart.friday[4],
            },
            {
              label: dataApiChart.saturday[2],
              y: [dataApiChart.saturday[0], dataApiChart.saturday[1]],
              name: dataApiChart.saturday[3],
              linkCdn: dataApiChart.saturday[4],
            },
            {
              label: dataApiChart.sunday[2],
              y: [dataApiChart.sunday[0], dataApiChart.sunday[1]],
              name: dataApiChart.sunday[3],
              linkCdn: dataApiChart.sunday[4],
            },
          ],
        },
      ],
    });
    chart.render();
  
    var images = [];
  
    addImages(chart);
  
    function addImages(chart) {
      for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
        var dpsName = chart.data[0].dataPoints[i].name;
        // console.log(chart.data[0].dataPoints[i].linkCdn);
        //thêm phần tử linkCdn vào dataPoint rồi dùng hàm for render ra ngoài.
          images.push(
            $("<img>").attr(
              "src",
              chart.data[0].dataPoints[i].linkCdn
            )
          );
          images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
          positionImage(images[i], i);
      }
    }
    
    function positionImage(image, index) {
      var imageCenter = chart.axisX[0].convertValueToPixel(
        chart.data[0].dataPoints[index].x
      );
      var imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

      image.width("60px").css({
        left: imageCenter - 33 + "px",
        position: "absolute",
        top: imageTop - 25 +"px",
        position: "absolute",
      });
    }
    $(window).resize(function () {
      var counterWeather = 0;
      var imageCenter = 0;
      for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
        imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
        var assignValue = chart.data[0].dataPoints[i].name;
        document.querySelector(assignValue).eq(counterWeather++).css({ left: imageCenter});
        //chọn lấy class có tên chart.data[0].dataPoints[i].name rồi add vào css
      }
    });
  
    function formatter(e) {
      if (e.index === 0 && e.dataPoint.x === 0) {
        return " Đêm " + e.dataPoint.y[e.index] + "°";
      } else if (e.index == 1 && e.dataPoint.x === 0) {
        return " Ngày " + e.dataPoint.y[e.index] + "°";
      } else {
        return e.dataPoint.y[e.index] + "°";
      }
    }
  };
  renderChart();
  
  var flagDropdownTemp = 1;
  //script show dropdown_location menu
  //and change location code html
  function show(anything) {
    var dataFromDropdown = (document.querySelector(".textBox").value = anything);
    var locationChoose = document.querySelector(".today_location-name");
    locationChoose.innerHTML = dataFromDropdown;
    document.querySelector(".today_details-title").innerHTML = `Thời tiết hôm nay tại ${dataFromDropdown}`;
  }
  show(dataApiCurrent.locationCurrent);


  //script change dropdown_location menu
  var getHN = document.querySelector(".changeCityHN");
  getHN.addEventListener("click", () => {
    show('Hà Nội');
    sessionStorage.setItem("location", "Hà Nội");
    location.reload();
  })
  var getHCM = document.querySelector(".changeCityHCM");
  getHCM.addEventListener("click", () => {
    show('Hồ Chí Minh');
    sessionStorage.setItem("location", "Hồ Chí Minh");
    location.reload();
  })
  

  // script show dropdown_temp menu
  let dropdown_location = document.querySelector(".dropdown_location");
  dropdown_location.onclick = function () {
    dropdown_location.classList.toggle("active");
  };
  //fix bug when click double city
  if(sessionStorage.getItem("location") == "Hà Nội") {
    document.querySelector('.changeCityHN').classList.add('disable_click');
    document.querySelector('.changeCityHCM').classList.remove('disable_click');
  };
  if(sessionStorage.getItem("location") == "Hồ Chí Minh") {
    document.querySelector('.changeCityHCM').classList.add('disable_click');
    document.querySelector('.changeCityHN').classList.remove('disable_click');
  };




  //fix bug when click C to C or F to F
    var getCel = document.querySelector('.Celsius').classList;
    getCel.add('disable_click');
    
  //change C to F and F to C
  
  
  function show_temp(anything) {
    var dropdownTemp = document.querySelector(".textBox_temp").value = anything;
    if(dropdownTemp == "°C") {
    //fix bug when click C to C or F to F
        flagDropdownTemp = 1;
        if (flagDropdownTemp == 1) {
          var getCel = document.querySelector('.Celsius').classList;
          getCel.add('disable_click');
          var getFah = document.querySelector('.Fahrenheit').classList;
          getFah.remove('disable_click');
          }
        document.querySelector('.temp_main').innerHTML = `${dataApiCurrent.tempCurrent}°`;
        document.querySelector('.temp_content').innerHTML = `${dataApiCurrent.feelTempCurrent}°`;
        document.querySelector('.details_left > :first-child > .items_right').innerHTML = `${dataApiCurrent.tempDay}°/${dataApiCurrent.tempNight}°`;
        document.querySelector('.details_right > :nth-child(2) > :nth-child(2)').innerHTML = `${dataApiCurrent.detailsCurrent[4]}`;
        
        for( var props in dataApiChart) { // get all properties from dataApiChart and handle logic 
          function cToF_changeDataChart(tempNight,tempDay) {
            var cToFtempNight = (tempNight - 32) * 5 / 9;
            var cToFtempDay = (tempDay - 32) * 5 / 9;
            return dataApiChart[props][0] = Number(cToFtempNight.toFixed()),
            dataApiChart[props][1] = Number(cToFtempDay.toFixed());
          }
          cToF_changeDataChart(dataApiChart[props][0],dataApiChart[props][1]);
        }
        
      //update chart
      var updateChart = function() {
        var chart = new CanvasJS.Chart("chartContainer", {
          title: {
            text: "Dự báo thời tiết hàng ngày",
            fontFamily: "arial",
            padding: 16,
          },
          axisY: {
            suffix: " °C",
            maximum: 50,
            gridThickness: 0,
          },
          toolTip: {
            shared: true,
            content:
              "{name} </br> <strong>Nhiệt độ: </strong> </br> Đêm: {y[0]} °C, Ngày: {y[1]} °C",
          },
          data: [
            {
              type: "rangeSplineArea",
              fillOpacity: 0.1,
              highlightEnabled: true,
              color: "#91AAB1",
              indexLabelFormatter: formatter,
              dataPoints: [
                {
                  label: dataApiChart.monday[2],
                  y: [dataApiChart.monday[0], dataApiChart.monday[1]],
                  name: dataApiChart.monday[3],
                  linkCdn: dataApiChart.monday[4],
                },
                {
                  label: dataApiChart.tuesday[2],
                  y: [dataApiChart.tuesday[0], dataApiChart.tuesday[1]],
                  name: dataApiChart.tuesday[3],
                  linkCdn: dataApiChart.tuesday[4],
                },
                {
                  label: dataApiChart.wednesday[2],
                  y: [ dataApiChart.wednesday[0],  dataApiChart.wednesday[1]],
                  name: dataApiChart.wednesday[3],
                  linkCdn: dataApiChart.wednesday[4],
                },
                {
                  label:  dataApiChart.thursday[2],
                  y: [ dataApiChart.thursday[0],  dataApiChart.thursday[1]],
                  name: dataApiChart.thursday[3],
                  linkCdn: dataApiChart.thursday[4],
                },
                {
                  label: dataApiChart.friday[2],
                  y: [dataApiChart.friday[0], dataApiChart.friday[1]],
                  name: dataApiChart.friday[3],
                  linkCdn: dataApiChart.friday[4],
                },
                {
                  label: dataApiChart.saturday[2],
                  y: [dataApiChart.saturday[0], dataApiChart.saturday[1]],
                  name: dataApiChart.saturday[3],
                  linkCdn: dataApiChart.saturday[4],
                },
                {
                  label: dataApiChart.sunday[2],
                  y: [dataApiChart.sunday[0], dataApiChart.sunday[1]],
                  name: dataApiChart.sunday[3],
                  linkCdn: dataApiChart.sunday[4],
                },
              ],
            },
          ],
        });
        chart.render();
      
        var images = [];
      
        addImages(chart);
      
        function addImages(chart) {
          for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
            var dpsName = chart.data[0].dataPoints[i].name;
            // console.log(chart.data[0].dataPoints[i].linkCdn);
            //thêm phần tử linkCdn vào dataPoint rồi dùng hàm for render ra ngoài.
              images.push(
                $("<img>").attr(
                  "src",
                  chart.data[0].dataPoints[i].linkCdn
                )
              );
              images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
              positionImage(images[i], i);
          }
        }
        
        function positionImage(image, index) {
          var imageCenter = chart.axisX[0].convertValueToPixel(
            chart.data[0].dataPoints[index].x
          );
          var imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
    
          image.width("60px").css({
            left: imageCenter - 33 + "px",
            position: "absolute",
            top: imageTop - 25 +"px",
            position: "absolute",
          });
        }
        $(window).resize(function () {
          var counterWeather = 0;
          var imageCenter = 0;
          for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
            imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
            var assignValue = chart.data[0].dataPoints[i].name;
            document.querySelector(assignValue).eq(counterWeather++).css({ left: imageCenter});
            //chọn lấy class có tên chart.data[0].dataPoints[i].name rồi add vào css
          }
        });
      
        function formatter(e) {
          if (e.index === 0 && e.dataPoint.x === 0) {
            return " Đêm " + e.dataPoint.y[e.index] + "°";
          } else if (e.index == 1 && e.dataPoint.x === 0) {
            return " Ngày " + e.dataPoint.y[e.index] + "°";
          } else {
            return e.dataPoint.y[e.index] + "°";
          }
        }
      };
      updateChart();
          
      //update slider
      for( var props in dataApiHistory) { // get all properties from dataApiChart and handle logic 
          function cToF_changeDataChart(tempNight,tempDay) {
            var cToFtempNight =  (tempNight - 32) * 5 / 9;
            var cToFtempDay = (tempDay - 32) * 5 / 9;
            return dataApiHistory[props].dayTemp = Number(cToFtempNight.toFixed()),
            dataApiHistory[props].nightTemp = Number(cToFtempDay.toFixed());
          }
          cToF_changeDataChart(dataApiHistory[props].dayTemp,dataApiHistory[props].nightTemp);
        }
        renderSlider();
  
    }
  
    if(dropdownTemp == "°F") {
        //fix bug when click C to C or F to F
        flagDropdownTemp = 2;
        if (flagDropdownTemp == 2) {
          var getFah = document.querySelector('.Fahrenheit').classList;
          getFah.add('disable_click');
          var getCel = document.querySelector('.Celsius').classList;
          getCel.remove('disable_click');
        }
  
        function cToF(temp) {
          var cToF =  temp * 9 / 5 + 32;
          var getTempMain = document.querySelector('.temp_main');
          return getTempMain.innerHTML = `${cToF.toFixed()}°`;
        }
        cToF(dataApiCurrent.tempCurrent);
        
        function cToF_tempFeel (temp) {
          var cToF =  temp * 9 / 5 + 32;
          var getTem_content = document.querySelector('.temp_content');
          return getTem_content.innerHTML = `${cToF.toFixed()}°`;
        }
        cToF_tempFeel(dataApiCurrent.feelTempCurrent);
        
        function cToF_highLow (temp1,temp2) {
            var cToF =  temp1 * 9 / 5 + 32;
            var cTooF = temp2 * 9 / 5 + 32;
            var getDayNightTemp = document.querySelector('.day-night_temp');
            var getHighLowTemp = document.querySelector('.details_left > :first-child > .items_right');
            return getDayNightTemp.innerHTML = `Ngày ${cToF.toFixed()}° <span class="dot_temp">.</span> Đêm ${cTooF.toFixed()}°`,
            getHighLowTemp.innerHTML = `${cToF.toFixed()}°/${cTooF.toFixed()}°`;
        }
        cToF_highLow(dataApiCurrent.tempDay,dataApiCurrent.tempNight);
      
        function cToF_boilingPoint(temp) {
          var cToF =  temp * 9 / 5 + 32;
          var get_boilingPoint = document.querySelector('.details_right > :nth-child(2) > :nth-child(2)');
          return get_boilingPoint.innerHTML = `${cToF.toFixed()}°`;
        }
        cToF_boilingPoint(dataApiCurrent.detailsCurrent[4].slice(0,2)); //slice string 25°
        for( var props in dataApiChart) { // get all properties from dataApiChart and handle logic 
          // console.log(dataApiChart[props][0],dataApiChart[props][1]);
          function cToF_changeDataChart(tempNight,tempDay) {
            var cToFtempNight =  tempNight * 9 / 5 + 32;
            var cToFtempDay = tempDay * 9 / 5 + 32;
            return dataApiChart[props][0] = Number(cToFtempNight.toFixed()),
              dataApiChart[props][1] = Number(cToFtempDay.toFixed());
          }
          cToF_changeDataChart(dataApiChart[props][0],dataApiChart[props][1]);
        }
        
        //update chart
        var updateChart = function() {
          var chart = new CanvasJS.Chart("chartContainer", {
            title: {
              text: "Dự báo thời tiết hàng ngày",
              fontFamily: "arial",
              padding: 16,
            },
            axisY: {
              suffix: "°F",
              maximum: 110,
              gridThickness: 0,
            },
            toolTip: {
              shared: true,
              content:
                "{name} </br> <strong>Nhiệt độ: </strong> </br> Đêm: {y[0]} °F, Ngày: {y[1]} °F",
            },
            data: [
              {
                type: "rangeSplineArea",
                fillOpacity: 0.1,
                highlightEnabled: true,
                color: "#91AAB1",
                indexLabelFormatter: formatter,
                dataPoints: [
                  {
                    label: dataApiChart.monday[2],
                    y: [dataApiChart.monday[0], dataApiChart.monday[1]],
                    name: dataApiChart.monday[3],
                    linkCdn: dataApiChart.monday[4],
                  },
                  {
                    label: dataApiChart.tuesday[2],
                    y: [dataApiChart.tuesday[0], dataApiChart.tuesday[1]],
                    name: dataApiChart.tuesday[3],
                    linkCdn: dataApiChart.tuesday[4],
                  },
                  {
                    label: dataApiChart.wednesday[2],
                    y: [ dataApiChart.wednesday[0],  dataApiChart.wednesday[1]],
                    name: dataApiChart.wednesday[3],
                    linkCdn: dataApiChart.wednesday[4],
                  },
                  {
                    label:  dataApiChart.thursday[2],
                    y: [ dataApiChart.thursday[0],  dataApiChart.thursday[1]],
                    name: dataApiChart.thursday[3],
                    linkCdn: dataApiChart.thursday[4],
                  },
                  {
                    label: dataApiChart.friday[2],
                    y: [dataApiChart.friday[0], dataApiChart.friday[1]],
                    name: dataApiChart.friday[3],
                    linkCdn: dataApiChart.friday[4],
                  },
                  {
                    label: dataApiChart.saturday[2],
                    y: [dataApiChart.saturday[0], dataApiChart.saturday[1]],
                    name: dataApiChart.saturday[3],
                    linkCdn: dataApiChart.saturday[4],
                  },
                  {
                    label: dataApiChart.sunday[2],
                    y: [dataApiChart.sunday[0], dataApiChart.sunday[1]],
                    name: dataApiChart.sunday[3],
                    linkCdn: dataApiChart.sunday[4],
                  },
                ],
              },
            ],
          });
          chart.render();
        
          var images = [];
        
          addImages(chart);
        
          function addImages(chart) {
            for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
              var dpsName = chart.data[0].dataPoints[i].name;
              // console.log(chart.data[0].dataPoints[i].linkCdn);
              //thêm phần tử linkCdn vào dataPoint rồi dùng hàm for render ra ngoài.
                images.push(
                  $("<img>").attr(
                    "src",
                    chart.data[0].dataPoints[i].linkCdn
                  )
                );
                images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
                positionImage(images[i], i);
            }
          }
          
          function positionImage(image, index) {
            var imageCenter = chart.axisX[0].convertValueToPixel(
              chart.data[0].dataPoints[index].x
            );
            var imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
      
            image.width("60px").css({
              left: imageCenter - 33 + "px",
              position: "absolute",
              top: imageTop - 25 +"px",
              position: "absolute",
            });
          }
          $(window).resize(function () {
            var counterWeather = 0;
            var imageCenter = 0;
            for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
              imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
              var assignValue = chart.data[0].dataPoints[i].name;
              document.querySelector(assignValue).eq(counterWeather++).css({ left: imageCenter});
              //chọn lấy class có tên chart.data[0].dataPoints[i].name rồi add vào css
            }
          });
        
          function formatter(e) {
            if (e.index === 0 && e.dataPoint.x === 0) {
              return " Đêm " + e.dataPoint.y[e.index] + "°";
            } else if (e.index == 1 && e.dataPoint.x === 0) {
              return " Ngày " + e.dataPoint.y[e.index] + "°";
            } else {
              return e.dataPoint.y[e.index] + "°";
            }
          }
        };
        updateChart();
        
        //update slider
        for( var props in dataApiHistory) { // get all properties from dataApiChart and handle logic 
          function cToF_changeDataChart(tempNight,tempDay) {
            var cToFtempNight =  tempNight * 9 / 5 + 32;
            var cToFtempDay = tempDay * 9 / 5 + 32;
            return dataApiHistory[props].dayTemp = Number(cToFtempNight.toFixed()),
            dataApiHistory[props].nightTemp = Number(cToFtempDay.toFixed());
          }
          cToF_changeDataChart(dataApiHistory[props].dayTemp,dataApiHistory[props].nightTemp);
        }
        renderSlider();
    } 
  };
  
  let dropdown_temp = document.querySelector(".dropdown_temp");
  dropdown_temp.onclick = function () {
    dropdown_temp.classList.toggle("active");
  };
  
  //script change C to F and F to C
  var getClickByCel = document.querySelector('.Celsius');
  getClickByCel.addEventListener('click',()=>{
    show_temp('°C');
    showFtoCtoast();
  });

  var getClickByFal = document.querySelector('.Fahrenheit');
  getClickByFal.addEventListener('click',()=>{
    show_temp('°F');
    showCtoFtoast();
  });
  
  //script slider daily weather
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 5,
    centeredSlides: false,
    spaceBetween: 3,
    grabCursor: true,
  });
  
  var renderSlider = function () {
    var arrContainerSlide = document.querySelectorAll(".swiper-slide");
    for (var i = 0; i < arrContainerSlide.length; i++) {
      var position1 = dataApiHistory[i].date.indexOf('(');
      var position2 = dataApiHistory[i].date.indexOf(')');
      var getDateApi = dataApiHistory[i].date.slice(position1 + 1,position2);
      var today = `${day}/${month}`;
      if (getDateApi == today) {
         dataApiHistory[i].date = `Hôm nay (${getDateApi})` //change var dateApiHistory.date
         var current_day = i;
      }
      arrContainerSlide[i].innerHTML = `
      <div class="date_slider">${dataApiHistory[i].date}</div>
      <div class="day_temp_slider color_temp">${dataApiHistory[i].dayTemp}°</div>
      <div class="night_temp_slider color_temp">${dataApiHistory[i].nightTemp}°</div>
      <div class="weather_slider_icon">
      <img class="mx-auto" src="">
      </div>
      <div class="humidity_percent_slider mt-3">
      <i class="fa-solid fa-cloud-rain"></i> 
      <span>${dataApiHistory[i].rainPercent}%</span>
      </div>
      `
      if (getDateApi == today) {
        arrContainerSlide[i].innerHTML = `
        <div class="date_slider bolder">${dataApiHistory[i].date}</div>
        <div class="day_temp_slider color_temp bolder">${dataApiHistory[i].dayTemp}°</div>
        <div class="night_temp_slider color_temp bolder">${dataApiHistory[i].nightTemp}°</div>
        <div class="weather_slider_icon">
        <img class="mx-auto" src="${dataApiHistory[i].weatherDay}">
        </div>
        <div class="humidity_percent_slider mt-3">
        <i class="fa-solid fa-cloud-rain"></i> 
        <span class="bolder">${dataApiHistory[i].rainPercent}%</span>
        </div>
        `
       }
    }
    var getDataIcon = document.querySelectorAll(".weather_slider_icon > img");
    for (var i = 0; i < getDataIcon.length;i++) {
        getDataIcon[i].src = dataApiHistory[i].weatherDay;
    }
    swiper.activeIndex = current_day; //detect current day in slider
  }
  renderSlider();
  


  //toast messenge
  function showFtoCtoast() {
    toast({
      title: "Thành công",
      message: "Chuyển đổi từ °F sang °C",
      type: "success",
      duration: 1000  
    });
  }

 
  function showCtoFtoast() {
    toast({
      title: "Thành công",
      message: "Chuyển đổi từ °C sang °F ",
      type: "success", 
      duration: 1000
    });
  }
  
  function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
      const toast = document.createElement("div");
  
      // Auto remove toast
      const autoRemoveId = setTimeout(function () {
        main.removeChild(toast);
      }, duration + 1000);
  
      // Remove toast when clicked
      toast.onclick = function (e) {
        if (e.target.closest(".toast__close")) {
          main.removeChild(toast);
          clearTimeout(autoRemoveId);
        }
      };
      const icons = {
        success: "fas fa-check-circle",
        info: "fas fa-info-circle",
        warning: "fas fa-exclamation-circle",
        error: "fas fa-exclamation-circle"
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);
  
      toast.classList.add("toast", `toast--${type}`);
      toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
  
      toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
      main.appendChild(toast);
    }
  }
  //scroll on top

  let getbutton = document.querySelector(".btnScrollTop");

  getbutton.addEventListener("click", () => {
    ontopFunction();
  });

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 20) {
      getbutton.style.display = "block";
    } else {
      getbutton.style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  function ontopFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

};