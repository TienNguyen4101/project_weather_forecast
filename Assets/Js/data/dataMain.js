if (sessionStorage.getItem("location") == null) {
	sessionStorage.setItem("location", "Hà Nội");
}
if (sessionStorage.getItem("location") == "Hà Nội") {
// script data API return
var post_api_HN_current = "https://1959-27-72-29-71.ap.ngrok.io/api/data_current?loc_id=1";
var post_api_HN_chart = "https://1959-27-72-29-71.ap.ngrok.io/api/data_chart?loc_id=1";
var post_api_HN_history = "https://1959-27-72-29-71.ap.ngrok.io/api/data_history?loc_id=1";

const promise1 = new Promise(function(resolve) {
      var dataApiCurrent = fetch(post_api_HN_current)
      .then(res => {
        return res.json();
      })
      .finally(dataItem => {
        return dataItem;
      })
      resolve(dataApiCurrent);
});
const promise2 = new Promise(function(resolve) {
      var dataApiChart = fetch(post_api_HN_chart)
      .then(res => {
        return res.json();
      })
      .finally(dataItem => {
        return dataItem;
      })
      resolve(dataApiChart);
});
const promise3 = new Promise(function(resolve) {
      var dataApiHistory = fetch(post_api_HN_history)
      .then(res => {
        return res.json();
      })
      .finally(dataItem => {
        return dataItem;
      })
      resolve(dataApiHistory);
});

Promise.all([promise1, promise2 , promise3]).then((value) => {
  var dataApiCurrent = value[0];
  var dataApiChart = value[1];
  var dataApiHistory = value[2];
  console.log(value);
  allInOne(dataApiCurrent, dataApiChart , dataApiHistory);
});
}

if (sessionStorage.getItem("location") == "Hồ Chí Minh") {
	// script data API return
	var post_api_HCM_current = "https://1959-27-72-29-71.ap.ngrok.io/api/data_current?loc_id=2";
	var post_api_HCM_chart = "https://1959-27-72-29-71.ap.ngrok.io/api/data_chart?loc_id=2";
	var post_api_HCM_history = "https://1959-27-72-29-71.ap.ngrok.io/api/data_history?loc_id=2";
	
	const promise1 = new Promise(function(resolve) {
		  var dataApiCurrent = fetch(post_api_HCM_current)
		  .then(res => {
			return res.json();
		  })
		  .finally(dataItem => {
			return dataItem;
		  })
		  resolve(dataApiCurrent);
	});
	const promise2 = new Promise(function(resolve) {
		  var dataApiChart = fetch(post_api_HCM_chart)
		  .then(res => {
			return res.json();
		  })
		  .finally(dataItem => {
			return dataItem;
		  })
		  resolve(dataApiChart);
	});
	const promise3 = new Promise(function(resolve) {
		  var dataApiHistory = fetch(post_api_HCM_history)
		  .then(res => {
			return res.json();
		  })
		  .finally(dataItem => {
			return dataItem;
		  })
		  resolve(dataApiHistory);
	});
	
	Promise.all([promise1, promise2 , promise3]).then((value) => {
	  var dataApiCurrent = value[0];
	  var dataApiChart = value[1];
	  var dataApiHistory = value[2];
	  console.log(value);
	  allInOne(dataApiCurrent, dataApiChart , dataApiHistory);
	});
}
