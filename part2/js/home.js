  $(function(){
          
            var reports = [];               
               $.ajax({	
                        
                        type: "get",
                        url: "data/json.js",
                        beforeSend: function() {

                            $("#result").html("Loading...");
                        },
                        timeout: 10000,
                        error: function(xhr, status, error) {
                          //  $("#dialog").dialog();
                        },
                        dataType: "json", 
                        success: function(response) {

                           $("#result").html("");
                                console.log("Result " + response);
                                var items = "";
                                $.each(response, function() {
                                    $.each(this, function(key, value) {
                                                                                
                                           var thisEmp = '[{"Name":"' + value.Name + '", \
                                           "Title":"' + value.Title + '", \
                                           "ImagePath":"' + value.ImagePath + '", \
                                           "OfficeNumber":"' + value.OfficeNumber + '", \
                                           "CellNumber":"' + value.CellNumber + '", \
                                           "Email":"' + value.Email + '", \
                                           "ReportsTo":"' + value.ReportsTo + '", \
                                           "DirectReports":"0" \
                                        }]';
                                           sessionStorage.setItem(value.ID, thisEmp);
                                           items += "<li><a href='#' id='" + value.ID + "' data-transition='slideup'><img src='"+ value.ImagePath + "'><h3>" + value.Name + "</h3><br>" + value.Title + "<div class='numReports ui-li-count' id='numReports-" + value.ID + "'>0</div></a></li>";                                          
                                                                                                                               
                                       var myManager = value.ReportsTo;

                                       if(reports[myManager] != undefined){

                                           reports[myManager]++;
                                       }
                                       else{

                                           reports[myManager] = 1;
                                       }

                                    });   // inner each
                                }); // outer each
                                                      
                            $('#result').html(items);
                            $('#result').listview().listview('refresh'); 
        
  
                            // get number of reports from array and put in object and show in list
                                for(var myKey = 1; myKey <= reports.length; myKey++){
                                
                                   var keyIndex = "'" + myKey + "'";
                                   var myval = reports[myKey];
                                   
                                  if(!isNaN(myval)){
                                      
                                      var myData = sessionStorage.getItem(myKey);
                                      var dataParsed = JSON.parse(myData);
                                      dataParsed[0]['DirectReports'] = myval;   // put number of direct reports in object
                                      var newData = JSON.stringify(dataParsed);
                                      sessionStorage.setItem(myKey, newData);
                                      $('#numReports-' + myKey).html(reports[myKey]);   // show number of direct reports in list
                                  }
                            }
 
                    }
                });  // end ajax code
      

             function clearWelcome() { 
                 
                 if ($("#result li").hasClass("ui-last-child")) {

                    //this listview has been displayed
                      $('#homeSection').html("");
                  //   console.log("clearWelcome ---");
                    clearInterval(intervalID);
                 }
           }
           var intervalID = setInterval(clearWelcome, 2000);
      
       });

        $(document).on("click", "#result a, #reportList a", function(e) {
            
            sessionStorage.setItem("currentID", e.currentTarget.id);
            var numReportsId = $(e.currentTarget.id).find('div.numPeports').attr('id');
            $(':mobile-pagecontainer').pagecontainer('change', "#details");
        });

        $(document).on("pageshow", "#details", function(e) {
                                       
                    var myId =  sessionStorage.getItem("currentID");
                  
                    var myData = sessionStorage.getItem(myId);
                    var dataParsed = JSON.parse(myData);
                  
                    var thisName = dataParsed[0]["Name"];
                    var imgSrc = dataParsed[0]["ImagePath"];
                    var managerID = dataParsed[0]["ReportsTo"];
                    var detailPage;
                    var items;
                    
                    $.ajax({	
                        
                        type: "get",
                        url: "data/json.js",
                        beforeSend: function() {

                            $("#empDetail").html("Loading...");
                        },
                        timeout: 10000,
                        error: function(xhr, status, error) {
                        },
                        dataType: "json", 
                        success: function(result) {

                            detailPage = "<div><img src='" + imgSrc + "'><h3>" + dataParsed[0].Name + "</h3><h4>" + dataParsed[0].Title + "</h4></div>";
                            
                            if(managerID == undefined || managerID == "" || managerID == 0){
                                items = "";
                            }
                            else{
                                items = "<li><a href='#details' id='" + dataParsed[0]["ReportsTo"] + "' data-transition='slideup'><h3>View Manager</h3>" + result["employees"][managerID].Name + "</a></li>";
                            }
                                                        
                            if(dataParsed[0]['DirectReports'] != '0'){
                                items += "<li class='viewReports'><a href='#' id='" + myId + "' data-transition='slideup'><h3>View Direct Reports</h3>" + dataParsed[0]['DirectReports'] + "</a></li>";
                            }
                            else{
                                items += "<li><a href='#' id='" + myId + "' data-transition='slideup'><h3>View Direct Reports</h3>" + "No Direct Reports" + "</a></li>";
                            }
                            
                            var officePhone = dataParsed[0]['OfficeNumber'].replace(/-/g,"");
                            var cellPhone = dataParsed[0]['CellNumber'].replace(/-/g,"");
                            items += "<li><a href='tel:+1" + officePhone + "' data-role='button' rel='external' ><h3>Call Office</h3>" + dataParsed[0]['OfficeNumber'] + "</a></li>";
                            items += "<li><a href='tel:+1" + cellPhone + "' data-role='button' rel='external' ><h3>Call Cell</h3>" + dataParsed[0]['CellNumber'] + "</a></li>";
                            items += "<li><a href='#' ><h3>Email</h3>" + dataParsed[0]['Email'] + "</a></li>";
                            
                            
                            $('#empDetail').html(detailPage);
                            $("#empDetail div").css("text-align","left").css("margin-right","30%");
                            $("#empDetail div h3").css("display","inline-block").css("margin-bottom","0").css("margin-top","50px").css("font-size","1.5em");
                            $("#empDetail div img").css("float","left").css("margin-right","3em");

                            $('#detailsList').html(items);
                            $('#detailsList').listview().listview('refresh'); 
                            $('#detailsList').css("clear","both").css("margin-top","50px");
                                                  
                        }

                    });    // end ajax call
                  
        });