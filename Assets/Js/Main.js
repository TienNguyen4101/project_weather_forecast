function allInOne(dataApiCurrent, dataApiChart, dataApiHistory) {
    //script render Chart JS and fix Multiple readback canvas
    setTimeout(function() {
      var renderChart = function(titleText,suffixAxisY,maximumAxisY,temperature,day,night) {
        var chart = new CanvasJS.Chart("chartContainer", {
          title: {
          text: titleText,
          fontFamily: "arial",
          padding: 16,
          },
          axisY: {
          suffix: suffixAxisY,
          maximum: maximumAxisY,
          gridThickness: 0,
          },
          toolTip: {
          shared: true,
          content:
            "{name} </br> <strong>{temperature}: </strong> </br> {day}: {y[0]} °C, {night}: {y[1]} °C",
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
              day: day,
              night: night,
              suffixAxisY: suffixAxisY,
              temperature: temperature,
            },
            {
              label: dataApiChart.tuesday[2],
              y: [dataApiChart.tuesday[0], dataApiChart.tuesday[1]],
              name: dataApiChart.tuesday[3],
              linkCdn: dataApiChart.tuesday[4],
              day: day,
              night: night,
              suffixAxisY: suffixAxisY,
              temperature: temperature,
            },
            {
              label: dataApiChart.wednesday[2],
              y: [ dataApiChart.wednesday[0],  dataApiChart.wednesday[1]],
              name: dataApiChart.wednesday[3],
              linkCdn: dataApiChart.wednesday[4],
              day: day,
              night: night,
              suffixAxisY: suffixAxisY,
              temperature: temperature,
            },
            {
              label:  dataApiChart.thursday[2],
              y: [ dataApiChart.thursday[0],  dataApiChart.thursday[1]],
              name: dataApiChart.thursday[3],
              linkCdn: dataApiChart.thursday[4],
              day: day,
              night: night,
              suffixAxisY: suffixAxisY,
              temperature: temperature,
            },
            {
              label: dataApiChart.friday[2],
              y: [dataApiChart.friday[0], dataApiChart.friday[1]],
              name: dataApiChart.friday[3],
              linkCdn: dataApiChart.friday[4],
              day: day,
              night: night,
              suffixAxisY: suffixAxisY,
              temperature: temperature,
            },
            {
              label: dataApiChart.saturday[2],
              y: [dataApiChart.saturday[0], dataApiChart.saturday[1]],
              name: dataApiChart.saturday[3],
              linkCdn: dataApiChart.saturday[4],
              day: day,
              night: night,
              suffixAxisY: suffixAxisY,
              temperature: temperature,
            },
            {
              label: dataApiChart.sunday[2],
              y: [dataApiChart.sunday[0], dataApiChart.sunday[1]],
              name: dataApiChart.sunday[3],
              linkCdn: dataApiChart.sunday[4],
              day: day,
              night: night,
              suffixAxisY: suffixAxisY,
              temperature: temperature,
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
          return ` ${night} `+ e.dataPoint.y[e.index] + "°";
          } else if (e.index == 1 && e.dataPoint.x === 0) {
          return  ` ${day} `  + e.dataPoint.y[e.index] + "°";
          } else {
          return e.dataPoint.y[e.index] + "°";
          }
        }
      };
      renderChart("Dự báo thời tiết hàng ngày"," °C",50,'Nhiệt độ','Ngày','Đêm');
    }, 500);
    
  //define temperature type local 
  var flagDropdownTemp = 'C';

  //define chart local
  var updateChart = function(titleText,suffixAxisY,maximumAxisY,temperature,day,night) {
      var chart = new CanvasJS.Chart("chartContainer", {
        title: {
        text: titleText,
        fontFamily: "arial",
        padding: 16,
        },
        axisY: {
        suffix: suffixAxisY,
        maximum: maximumAxisY,
        gridThickness: 0,
        },
        toolTip: {
        shared: true,
        content:
          "{name} </br> <strong>{temperature}: </strong> </br> {day}: {y[0]} {suffixAxisY}, {night}: {y[1]} {suffixAxisY}",
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
            day: day,
            night: night,
            suffixAxisY: suffixAxisY,
            temperature: temperature,
          },
          {
            label: dataApiChart.tuesday[2],
            y: [dataApiChart.tuesday[0], dataApiChart.tuesday[1]],
            name: dataApiChart.tuesday[3],
            linkCdn: dataApiChart.tuesday[4],
            day: day,
            night: night,
            suffixAxisY: suffixAxisY,
            temperature: temperature,
          },
          {
            label: dataApiChart.wednesday[2],
            y: [ dataApiChart.wednesday[0],  dataApiChart.wednesday[1]],
            name: dataApiChart.wednesday[3],
            linkCdn: dataApiChart.wednesday[4],
            day: day,
            night: night,
            suffixAxisY: suffixAxisY,
            temperature: temperature,
          },
          {
            label:  dataApiChart.thursday[2],
            y: [ dataApiChart.thursday[0],  dataApiChart.thursday[1]],
            name: dataApiChart.thursday[3],
            linkCdn: dataApiChart.thursday[4],
            day: day,
            night: night,
            suffixAxisY: suffixAxisY,
            temperature: temperature,
          },
          {
            label: dataApiChart.friday[2],
            y: [dataApiChart.friday[0], dataApiChart.friday[1]],
            name: dataApiChart.friday[3],
            linkCdn: dataApiChart.friday[4],
            day: day,
            night: night,
            suffixAxisY: suffixAxisY,
            temperature: temperature,
          },
          {
            label: dataApiChart.saturday[2],
            y: [dataApiChart.saturday[0], dataApiChart.saturday[1]],
            name: dataApiChart.saturday[3],
            linkCdn: dataApiChart.saturday[4],
            day: day,
            night: night,
            suffixAxisY: suffixAxisY,
            temperature: temperature,
          },
          {
            label: dataApiChart.sunday[2],
            y: [dataApiChart.sunday[0], dataApiChart.sunday[1]],
            name: dataApiChart.sunday[3],
            linkCdn: dataApiChart.sunday[4],
            day: day,
            night: night,
            suffixAxisY: suffixAxisY,
            temperature: temperature,
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
        return ` ${night} `+ e.dataPoint.y[e.index] + "°";
        } else if (e.index == 1 && e.dataPoint.x === 0) {
        return  ` ${day} `  + e.dataPoint.y[e.index] + "°";
        } else {
        return e.dataPoint.y[e.index] + "°";
        }
      }
  };
  setTimeout(updateChart,100);
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

   //script switch language
   //set local variable for change language
   var languageStatus = 'VN';
   var changeLanguage = function () {
    var btn = document.getElementById('btn');
    var getBtnLeft = document.querySelector('.toggle-btn-left');
    getBtnLeft.style.color = 'white';
    getBtnLeft.addEventListener('click', () =>  {
      vietsub();
      languageStatus = 'VN';
    });
    var getBtnRight = document.querySelector('.toggle-btn-right');
    getBtnRight.addEventListener('click', () => {
      engsub();
      languageStatus = 'EN';
    });

    function vietsub() {
      btn.style.left = '0'
      getBtnLeft.style.color = 'white';
      getBtnRight.style.removeProperty('color');
      //vietnamese sub
      
      if (dataApiCurrent.locationCurrent == 'Ha Noi') {
        dataApiCurrent.locationCurrent = 'Hà Nội';
        //vietsub input dropdown_location HN
        show(dataApiCurrent.locationCurrent);
        //vietsub dropdown_location HN
        document.querySelector('.changeCityHN').textContent =
        dataApiCurrent.locationCurrent;
        document.querySelector('.changeCityHCM').textContent =
        dataSub.vietnam.todayLocation[1];
        //vietsub today_location-name HN
        document.querySelector('.today_location-name').textContent =
        dataApiCurrent.locationCurrent;
        //vietsub today condition HN
        document.querySelector('.current_status').textContent = 
        dataApiCurrent.weatherCurrent;
        //vietsub today_details-title HN
        document.querySelector('.today_details-title').textContent =
        dataSub.vietnam.titleToday + ' ' + dataApiCurrent.locationCurrent;
        //vietsub day__temp and night__temp HN
        document.querySelector('.day__temp').textContent =
        dataSub.vietnam.dayNightTemp[0];
        document.querySelector('.night__temp').textContent =
        dataSub.vietnam.dayNightTemp[1];
        //vietsub temp_title HN
        document.querySelector('.temp_title').textContent =
        dataSub.vietnam.tempTitle;
        //vietsub today details HN
        var getAllItemsleft = document.querySelectorAll('.items_left > span');
        for(var i=0; i < getAllItemsleft.length; i++) {
          getAllItemsleft[i].textContent = dataSub.vietnam.itemsLeft[i];
          
        }
        for (let i in dataSub.english.windDirections) {
          //vietsub wind Directions HN
          var getWindDirection = document.querySelectorAll('.items_right > span')[4];
          if(getWindDirection.outerText == dataSub.english.windDirections[i]) {
            getWindDirection.textContent = dataSub.vietnam.windDirections[i];
          }
        }
        //change dateChart HN
        //vietsub HN
        function updateDataVietSub() {
          //handle the data convert to eng
          //handle data daily day
          for(let i in dataSub.english.dayofWeek) {
            for ( var props in dataApiChart) {
              var getDataDaily = dataApiChart[props][2].slice(0,-8);
              if ( getDataDaily == dataSub.english.dayofWeek[i]) {
                dataApiChart[props][2] =
                dataSub.vietnam.dayofWeek[i] + ' (' + dataApiChart[props][2].slice(-6, dataApiChart[props][2].indexOf(')')) + ')';
              }
            }
          }
          //handle data condition
          for ( let i in engsubCondition) {
            for (let props in dataApiChart) {
              if(dataApiChart[props][3] == engsubCondition[i].day) {
                dataApiChart[props][3] = engsubCondition_subbed[i].day;
              }
            }
          }
        }
        updateDataVietSub();
        // updateChart("Dự báo thời tiết hằng ngày","°C",50,'Nhiệt độ','Ngày','Đêm'); 
        //fix bug khi đang ở trang thái độ F mà chuyển đổi ngôn ngữ
        console.log(flagDropdownTemp);
        if(flagDropdownTemp == 'C') {
          updateChart("Dự báo thời tiết hằng ngày","°C",50,'Nhiệt độ','Ngày','Đêm');
        }
        else if(flagDropdownTemp =='F') {
          updateChart("Dự báo thời tiết hằng ngày","°F",100,'Nhiệt độ','Ngày','Đêm');
        }
      //vietsub history HN
      document.querySelector('.history_weather_title > span').textContent = 
      dataSub.vietnam.titleHistory;
      //vietsub history day HN
        let getDateHistory = document.querySelectorAll('.date_slider');
        for (let i in dataApiHistory) {
          getDateHistory[i].textContent = dataApiHistory[i].date;
        };
      //vietsub history button HN
      document.querySelector('.button_weather').textContent
      = dataSub.vietnam.btnWeather;
      //vietsub name member
      let getMemberName = document.querySelectorAll('.team_name');
      getMemberName[0].innerText = 'Nguyễn Ngọc Tiến - B19DCVT320';
      getMemberName[1].innerText = 'Nguyễn Thiện Lâm - B19DCVT215';
      getMemberName[2].innerText = 'Lương Ngọc Huy - B19DCVT175';
      getMemberName[3].innerText = 'Vũ Khắc Phiêu - B19DCVT279';

      };

      if (dataApiCurrent.locationCurrent == 'Ho Chi Minh') {
        dataApiCurrent.locationCurrent = 'Hồ Chí Minh';
        //vietsub input dropdown_location HCM
        show(dataApiCurrent.locationCurrent);
        //vietsub dropdown_location HCM
        document.querySelector('.changeCityHN').textContent =
        dataSub.vietnam.todayLocation[0];
        document.querySelector('.changeCityHCM').textContent =
        dataApiCurrent.locationCurrent;
        //vietsub today_location-name HCM
        document.querySelector('.today_location-name').textContent =
        dataApiCurrent.locationCurrent;
        //vietsub today condition HCM
        document.querySelector('.current_status').textContent = 
        dataApiCurrent.weatherCurrent;
        //vietsub today_details-title HCM
        document.querySelector('.today_details-title').textContent = 
        dataSub.vietnam.titleToday + ' ' + dataApiCurrent.locationCurrent;
        //vietsub day__temp and night__temp HCM
        document.querySelector('.day__temp').textContent =
        dataSub.vietnam.dayNightTemp[0];
        document.querySelector('.night__temp').textContent =
        dataSub.vietnam.dayNightTemp[1];
        //vietsub temp_title HCM
        document.querySelector('.temp_title').textContent =
        dataSub.vietnam.tempTitle;
        //vietsub today details HCM
        var getAllItemsleft = document.querySelectorAll('.items_left > span');
        for(var i=0; i < getAllItemsleft.length; i++) {
          getAllItemsleft[i].textContent = dataSub.vietnam.itemsLeft[i];
        }
        for (let i in dataSub.english.windDirections) {
          //vietsub wind Directions HCM
          var getWindDirection = document.querySelectorAll('.items_right > span')[4];
          if(getWindDirection.outerText == dataSub.english.windDirections[i]) {
            getWindDirection.textContent = dataSub.vietnam.windDirections[i];
          }
        }
        //vietsub HCM
        function updateDataVietSub() {
          //handle the data convert to eng
          //handle data daily day
          for(let i in dataSub.english.dayofWeek) {
            for ( var props in dataApiChart) {
              var getDataDaily = dataApiChart[props][2].slice(0,-8);
              if ( getDataDaily == dataSub.english.dayofWeek[i]) {
                dataApiChart[props][2] =
                dataSub.vietnam.dayofWeek[i] + ' (' + dataApiChart[props][2].slice(-6, dataApiChart[props][2].indexOf(')')) + ')';
              }
            }
          }
          //handle data condition
          for ( let i in engsubCondition) {
            for (let props in dataApiChart) {
              if(dataApiChart[props][3] == engsubCondition[i].day) {
                dataApiChart[props][3] = engsubCondition_subbed[i].day;
              }
            }
          }
        }
        updateDataVietSub();
        //fix bug khi đang ở trang thái độ F mà chuyển đổi ngôn ngữ
        if(flagDropdownTemp == 'C') {
          updateChart("Dự báo thời tiết hằng ngày","°C",50,'Nhiệt độ','Ngày','Đêm');
        }
        else if(flagDropdownTemp == 'F') {
          updateChart("Dự báo thời tiết hằng ngày","°F",100,'Nhiệt độ','Ngày','Đêm');
        }

      //vietsub history HCM
      document.querySelector('.history_weather_title > span').textContent = 
      dataSub.vietnam.titleHistory;
      }
      //vietsub history day HCM
      let getDateHistory = document.querySelectorAll('.date_slider');
      for (let i in dataApiHistory) {
        getDateHistory[i].textContent = dataApiHistory[i].date;
      };
      //vietsub history button HCM
      document.querySelector('.button_weather').textContent
      = dataSub.vietnam.btnWeather;
      //vietsub name member
      let getMemberName = document.querySelectorAll('.team_name');
      getMemberName[0].innerText = 'Nguyễn Ngọc Tiến - B19DCVT320';
      getMemberName[1].innerText = 'Nguyễn Thiện Lâm - B19DCVT215';
      getMemberName[2].innerText = 'Lương Ngọc Huy - B19DCVT175';
      getMemberName[3].innerText = 'Vũ Khắc Phiêu - B19DCVT279';
      
    };

    function engsub() {
      btn.style.left = '56px'
      getBtnRight.style.color = 'white';
      getBtnLeft.style.removeProperty('color');

      //english sub
    if (dataApiCurrent.locationCurrent == 'Hà Nội') {
      dataApiCurrent.locationCurrent = 'Ha Noi';
      //engsub input dropdown_location HN
      show(dataApiCurrent.locationCurrent);
      //engsub dropdown_location HN
      document.querySelector('.changeCityHN').textContent =
      dataApiCurrent.locationCurrent;
      document.querySelector('.changeCityHCM').textContent =
      dataSub.english.todayLocation[1];
      //engsub today_location-name HN
      document.querySelector('.today_location-name').textContent =
      dataApiCurrent.locationCurrent;
      //engsub today condition HN
      for (let i in engsubCondition) {
        if (engsubCondition[i].code == dataApiCurrent.themeCurrent) {
          document.querySelector('.current_status').textContent = 
          engsubCondition[i].day;
        }
      }
      //engsub today_details-title HN
      document.querySelector('.today_details-title').textContent = 
      dataSub.english.titleToday + ' ' + dataApiCurrent.locationCurrent;
      //engsub day__temp and night__temp HN
      document.querySelector('.day__temp').textContent =
      dataSub.english.dayNightTemp[0];
      document.querySelector('.night__temp').textContent =
      dataSub.english.dayNightTemp[1];
      //engsub temp_title HN
      document.querySelector('.temp_title').textContent =
      dataSub.english.tempTitle;
      //engsub today details HN
      var getAllItemsleft = document.querySelectorAll('.items_left > span');
      for(let i in getAllItemsleft ) {
        getAllItemsleft[i].textContent = dataSub.english.itemsLeft[i];
        }
      for (let i in dataSub.vietnam.windDirections) {
        //engsub wind Directions HN
        var getWindDirection = document.querySelectorAll('.items_right > span')[4];
        if(getWindDirection.outerText == dataSub.vietnam.windDirections[i]) {
          getWindDirection.textContent = dataSub.english.windDirections[i];
        }
      }
      
      // engsub Chart HN
      function changeDataApiEngSub() {
        for(let i in dataSub.vietnam.dayofWeek) {
          for ( var props in dataApiChart) {
            var getDataDaily = dataApiChart[props][2].slice(0,-8);
            if (getDataDaily == 'Hôm nay') {
            dataApiChart[props][2] =
            'Today' + ' (' + dataApiChart[props][2].slice(9,14) + ')';
            }
            if (getDataDaily == 'Chủ Nhật') {
              dataApiChart[props][2] =
              'Sunday' + ' (' + dataApiChart[props][2].slice(10,15) + ')';
              }
            if ( getDataDaily == dataSub.vietnam.dayofWeek[i]) {
              dataApiChart[props][2] =
              dataSub.english.dayofWeek[i] + ' (' + dataApiChart[props][2].slice(7,12) + ')';
            }
          }
        }
        for ( let i in engsubCondition_subbed) {
          for (let props in dataApiChart) {
            if(dataApiChart[props][3] == engsubCondition_subbed[i].day) {
              dataApiChart[props][3] = engsubCondition[i].day;
            }
          }
        }
      }
      changeDataApiEngSub();
      //fix bug khi đang ở trang thái độ F mà chuyển đổi ngôn ngữ
      console.log(flagDropdownTemp);
      if(flagDropdownTemp == 'C') {
        updateChart("Weekly Weather Forecast","°C",50,'Temperature','Day','Night');
      }
      else if(flagDropdownTemp == 'F') {
        updateChart("Weekly Weather Forecast","°F",100,'Temperature','Day','Night');
      }
      
      //engsub history HN
      document.querySelector('.history_weather_title > span').textContent = 
      dataSub.english.titleHistory;
      //engsub history day HN
      let getDateHistory = document.querySelectorAll('.date_slider');
      for (let i in dataApiHistory) {
        for (let j in dataSub.vietnam.dayofWeek) {
            if(dataApiHistory[i].date.slice(0,-8) == dataSub.vietnam.dayofWeek[j]) {
              getDateHistory[i].textContent = dataSub.english.dayofWeek[j] 
              + ' (' + dataApiHistory[i].date.slice(-6, dataApiHistory[i].date.indexOf(')')) + ')';
          }
        }
      }
      //engsub history button HN
      document.querySelector('.button_weather').textContent
      = dataSub.english.btnWeather;
          //engsub name member
        let getMemberName = document.querySelectorAll('.team_name');
        for(let i in getMemberName) {
          for(let j in dataSub.english.memberName) {
            if(getMemberName[i].innerText == dataSub.vietnam.memberName[j]) {
              getMemberName[i].innerText = dataSub.english.memberName[j];
            }
          }
        }
    };

    if (dataApiCurrent.locationCurrent == 'Hồ Chí Minh') {
      dataApiCurrent.locationCurrent = 'Ho Chi Minh';
      //engsub input dropdown_location
      show(dataApiCurrent.locationCurrent);
      //engsub dropdown_location HCM
      document.querySelector('.changeCityHN').textContent =
      dataSub.english.todayLocation[0];
      document.querySelector('.changeCityHCM').textContent =
      dataApiCurrent.locationCurrent;
      //engsub today_location-name HCM
      document.querySelector('.today_location-name').textContent =
      dataApiCurrent.locationCurrent;
      //engsub today condition HCM
      for (var i = 0; i < engsubCondition.length; i++) {
        if (engsubCondition[i].code == dataApiCurrent.themeCurrent) {
          document.querySelector('.current_status').textContent = 
          engsubCondition[i].day;
        }
      }
      //engsub today_details-title HCM
      document.querySelector('.today_details-title').textContent = 
      dataSub.english.titleToday + ' ' + dataApiCurrent.locationCurrent;
      //engsub day__temp and night__temp HCM
      document.querySelector('.day__temp').textContent =
      dataSub.english.dayNightTemp[0];
      document.querySelector('.night__temp').textContent =
      dataSub.english.dayNightTemp[1];
      //engsub temp_title HCM
      document.querySelector('.temp_title').textContent =
      dataSub.english.tempTitle;
      //engsub today details HCM
      var getAllItemsleft = document.querySelectorAll('.items_left > span');
        for(var i=0; i < getAllItemsleft.length; i++) {
          getAllItemsleft[i].textContent = dataSub.english.itemsLeft[i];
        }
        for( let i in dataSub.vietnam.windDirections) {
        //engsub wind Directions HCM
        var getWindDirection = document.querySelectorAll('.items_right > span')[4];
        if(getWindDirection.outerText == dataSub.vietnam.windDirections[i]) {
          getWindDirection.textContent = dataSub.english.windDirections[i];
        }
      }
      //change dateChart HCM
      function changeDataApiEngSub() {
        for(let i in dataSub.vietnam.dayofWeek) {
          for ( var props in dataApiChart) {
            var getDataDaily = dataApiChart[props][2].slice(0,-8);
            if (getDataDaily == 'Hôm nay') {
            dataApiChart[props][2] =
            'Today' + ' (' + dataApiChart[props][2].slice(9,14) + ')';
            }
            if (getDataDaily == 'Chủ Nhật') {
              dataApiChart[props][2] =
              'Sunday' + ' (' + dataApiChart[props][2].slice(10,15) + ')';
              }
            if ( getDataDaily == dataSub.vietnam.dayofWeek[i]) {
              dataApiChart[props][2] =
              dataSub.english.dayofWeek[i] + ' (' + dataApiChart[props][2].slice(7,12) + ')';
            }
          }
        }
        for ( let i in engsubCondition_subbed) {
          for (let props in dataApiChart) {
            if(dataApiChart[props][3] == engsubCondition_subbed[i].day) {
              dataApiChart[props][3] = engsubCondition[i].day;
            }
          }
        }
      }
      changeDataApiEngSub();
      //fix bug khi đang ở trang thái độ F mà chuyển đổi ngôn ngữ
      if(flagDropdownTemp == 'C') {
        updateChart("Weekly Weather Forecast","°C",50,'Temperature','Day','Night');
      }
      else if(flagDropdownTemp == 'F') {
        updateChart("Weekly Weather Forecast","°F",100,'Temperature','Day','Night');
      }

      //engsub history HCM
      document.querySelector('.history_weather_title > span').textContent = 
      dataSub.english.titleHistory;
        //engsub history day HCM
        let getDateHistory = document.querySelectorAll('.date_slider');
        for (let i in dataApiHistory) {
          for (let j in dataSub.vietnam.dayofWeek) {
              if(dataApiHistory[i].date.slice(0,-8) == dataSub.vietnam.dayofWeek[j]) {
                getDateHistory[i].textContent = dataSub.english.dayofWeek[j] 
                + ' (' + dataApiHistory[i].date.slice(-6, dataApiHistory[i].date.indexOf(')')) + ')';
              }
          }
        }
      //engsub history button HCM
      document.querySelector('.button_weather').textContent
      = dataSub.english.btnWeather;
      //engsub name member
      let getMemberName = document.querySelectorAll('.team_name');
      for(let i in getMemberName) {
        for(let j in dataSub.english.memberName) {
          if(getMemberName[i].innerText == dataSub.vietnam.memberName[j]) {
            getMemberName[i].innerText = dataSub.english.memberName[j];
          }
        }
      }
    }
    };
  };

   changeLanguage();   

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
            <span class="day__temp">Ngày</span> ${dataApiCurrent.tempDay}° <span class="dot_temp">.</span> <span class="night__temp">Đêm</span> ${dataApiCurrent.tempNight}°
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
        var containerCodeRain = [1063,1183,1180,1189,1198,1273,1276,1240,1243,1009];
          for(var i = 0; i < containerCodeRain.length; i++) {
            if (dataApiCurrent.themeCurrent == containerCodeRain[i]) {
              changeImage.src = "./Assets/Img/icon_forecast/rain.png";
            }
          }
        var containerCodeRain = [1030];
        for(var i = 0; i < containerCodeRain.length; i++) {
          if (dataApiCurrent.themeCurrent == containerCodeRain[i]) {
            changeImage.src = "./Assets/Img/icon_forecast/icon_mist.png";
          }
        }
      }
  };
  themeChange();


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
    show(dataApiCurrent.locationCurrent);
    sessionStorage.setItem("location", "Hà Nội");
    location.reload();  
  })
  var getHCM = document.querySelector(".changeCityHCM");
  getHCM.addEventListener("click", () => {
    show(dataApiCurrent.locationCurrent);
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
        flagDropdownTemp = 'C';
        if (flagDropdownTemp == 'C') {
          var getCel = document.querySelector('.Celsius').classList;
          getCel.add('disable_click');
          var getFah = document.querySelector('.Fahrenheit').classList;
          getFah.remove('disable_click');
          }
        document.querySelector('.temp_main').innerHTML = `${dataApiCurrent.tempCurrent}°`;
        document.querySelector('.temp_content').innerHTML = `${dataApiCurrent.feelTempCurrent}°`;
        document.querySelector('.details_left > :first-child > .items_right').innerHTML = `${dataApiCurrent.tempDay}°/${dataApiCurrent.tempNight}°`;
        // document.querySelector('.details_right > :nth-child(2) > :nth-child(2)').innerHTML = `${dataApiCurrent.detailsCurrent[4]}`;
        
        // update data chart
        for( var props in dataApiChart) { // get all properties from dataApiChart and handle logic 
          function cToF_changeDataChart(tempNight,tempDay) {
            var cToFtempNight = (tempNight - 32) * 5 / 9;
            var cToFtempDay = (tempDay - 32) * 5 / 9;
            return dataApiChart[props][0] = Number(cToFtempNight.toFixed()),
            dataApiChart[props][1] = Number(cToFtempDay.toFixed());
          }
          cToF_changeDataChart(dataApiChart[props][0],dataApiChart[props][1]);
        }
        
     
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
        flagDropdownTemp = 'F';
        if (flagDropdownTemp == 'F') {
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
          return getDayNightTemp.innerHTML = `<span class="day__temp">Ngày</span> ${cToF.toFixed()}°<span class="dot_temp">.</span><span class="night__temp">Đêm</span>${cTooF.toFixed()}°`,
          getHighLowTemp.innerHTML = `${cToF.toFixed()}°/${cTooF.toFixed()}°`;
        }
        cToF_highLow(dataApiCurrent.tempDay,dataApiCurrent.tempNight);
      
        // function cToF_boilingPoint(temp) {
        //   var cToF =  temp * 9 / 5 + 32;
        //   var get_boilingPoint = document.querySelector('.details_right > :nth-child(2) > :nth-child(2)');
        //   return get_boilingPoint.innerHTML = `${cToF.toFixed()}°`;
        // }
        // cToF_boilingPoint(dataApiCurrent.detailsCurrent[4].slice(0,2)); //slice string 25°

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
    if(languageStatus == 'VN') {
      updateChart("Dự báo thời tiết hằng ngày","°C",50,'Nhiệt độ','Ngày','Đêm'); 
    }
    else if(languageStatus == 'EN') {
      updateChart("Weekly Weather Forecast","°C",50,'Temperature','Day','Night'); 
    }
    showFtoCtoast();
  });

  var getClickByFal = document.querySelector('.Fahrenheit');
  getClickByFal.addEventListener('click',()=>{
    show_temp('°F');
    if(languageStatus == 'VN') {
      updateChart("Dự báo thời tiết hằng ngày","°F",100,'Nhiệt độ','Ngày','Đêm'); 
    }
    else if(languageStatus == 'EN') {
      updateChart("Weekly Weather Forecast","°F",100,'Temperature','Day','Night'); 
    }
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
      <!-- <img class="mx-auto" src="" "url('./Assets/Img/cloud/night_sky.jpg')"> -->
      <img class="mx-auto" src="https://cdn2.iconfinder.com/data/icons/weather-color-2/500/weather-03-512.png">
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
        </div>
        <div class="humidity_percent_slider mt-3">
        <i class="fa-solid fa-cloud-rain"></i> 
        <span class="bolder">${dataApiHistory[i].rainPercent}%</span>
        </div>
        `
       }
    }
    // var getDataIcon = document.querySelectorAll(".weather_slider_icon > img");
    // for (var i = 0; i < getDataIcon.length;i++) {
    //     getDataIcon[i].src = dataApiHistory[i].weatherDay;
    // }
    swiper.activeIndex = current_day; //detect current day in slider
  }
  renderSlider();
  
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