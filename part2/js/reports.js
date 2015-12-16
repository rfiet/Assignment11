   $(document).on("click", "#detailsList a", function(event) {

        sessionStorage.setItem("currentID", event.currentTarget.id);
        $(':mobile-pagecontainer').pagecontainer('change', "#reports");
    });

   $(document).on("pageshow", "#reports", function(event) {

                var  myId = sessionStorage.getItem("currentID");
                $.ajax({	

                    type: "get",
                    url: "data/json.js",
                    beforeSend: function() {

                        $("#reportList").html("Loading...");
                    },
                    timeout: 10000,
                    error: function(xhr, status, error) {
                    //    console.log("Error: " + xhr.status + " - " + error);
                    },
                    dataType: "json", 
                    success: function(response) {

                            var items = "";
                            $.each(response, function() {
                                $.each(this, function(key, value) {

                                    if(value.ReportsTo == myId){

                                        var reportsData =  sessionStorage.getItem(value.ID);
                                        var dataParsed = JSON.parse(reportsData);

                                       var numberOfReports = dataParsed[0]["DirectReports"];
                                        items += "<li><a href='#' id='" + value.ID + "' data-transition='slideup'><img src='"+ value.ImagePath + "'><h3>" + value.Name + "</h3><br>" + value.Title + "<div class='numReports ui-li-count' id='numOfReports-" + numberOfReports + "'>" + numberOfReports + "</div></a></li>";                                          
                                    }

                                });   // inner each
                            }); // outer each  

                            $('#reportList').html(items);
                            $('#reportList').listview().listview('refresh'); 

                    }  // end success

                });    // end ajax call

  });   // $('body').on('click', '#result a',...
