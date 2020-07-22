//Page Name:
document.getElementById("pageName").textContent = "Disciplinary Issues";

$(document).ready( function () {
    //Get Student:
    $('#disciplineStudent').submit(function (e) { 
        e.preventDefault();

        var ID = $('#studentIdentity').val();
        var IsValid = $('#disciplineStudent').valid();
        if (IsValid) {
            showStudent(ID);
        }
        
    });

    //Submit indiscipline case:
    $('#submitDisc').on('click', function () {
        
        var studentAdmNo = $('#studentId').val();
        var mistake = $('#mistake').val();
        var punishment = $('#punishment').val();

        var newCase = {
            "disciplineMessageSummary": mistake,
            "disciplinePunishmentIssued": punishment,
            "studentAdmNo": studentAdmNo,
            "teacherInvolvedID": teacherId
        }

        myJSON = JSON.stringify(newCase)
        JSON.parse(myJSON);

        var IsValid = $('#reportStudent').valid();
        if (IsValid) {
            $.ajax({
                type: "post",
                url: schoolUrl+"/disciplineCreate",
                data: myJSON,
                dataType: "json",
                contentType: 'application/json',
                headers : {
                    "Authorization" : 'Bearer ' + token.accessToken,
                    "contentType": "application/json",
                },
                processData: false,
                beforeSend: function() {
                    $('#discLoader').show();
                    $('#discLog').hide()
                },
                complete: function(){
                    $('#discLoader').hide();
                    $('#discLog').show();
                },
                success: function (response) {
                    if (response.code == 200) {
                        $('html, body').animate({
                            scrollTop: $("#disciplineReportFeedback").offset().top
                        }, 1000);
                        $("#disciplineReportFeedback").html(" <div class=\"alert alert-success alert-dismissible\" role=\"alert\">The discipline case has been reported successfully.. <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                        $('#profileRow').hide();
                        $("#disciplineStudent")[0].reset();
                    }else {
                        $('html, body').animate({
                            scrollTop: $("#disciplineReportFeedback").offset().top
                        }, 1000);
                        $("#disciplineReportFeedback").html(" <div class=\"alert alert-danger alert-dismissible \" role=\"alert\">"+response.message+".<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                    }
                    checkToken();
                },
                error: function() {
                    $('html, body').animate({
                        scrollTop: $("#disciplineReportFeedback").offset().top
                    }, 1000);
                    $("#disciplineReportFeedback").html(" <div class=\"alert alert-danger alert-dismissible \" role=\"alert\">Error connecting to the server. Do you have internet Connection?<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                    checkToken();
                }
            });
        }
        
    });

    //MyDiscipline Table:
    var myDiscipline = $('#myDisciplineTable').DataTable({
        dom: 'Bfrtip',
        processing: true,
        serverSide: false,
        scrollX: true,
        

        ajax : {
        type : "get",
        contentType: "application/json",
        dataType: "json",
        url : schoolUrl+"/disciplineForTeacher?teacherID="+teacherId,
        headers : {
            "Authorization" : 'Bearer ' + token.accessToken,
            "contentType": "application/json",
        },
        dataSrc : "data"
        },
        columns : [
            {"data" : "studentAdmNo"},
            {"data" : "disciplineMessageSummary"},
            {"data" : "disciplinePunishmentIssued"},
            {"data" : "createdAtDate"},
            {"data" : "availableToParent"},
            {"data" : ""}
        ],
        columnDefs: [ 
        {
            "targets" : [4],
            "data" : "availableToParent",
            render: function (a, b, data, d) {
                if (data.availableToParent == true) {
                    return "<span>Available</span>";
                } else if (data.availableToParent == false){
                    return "<span>NotAvailable</span>";
                }
                return "";
            },
        },
        {
            "targets" : [-1],
            "data" : "disciplineID",
            "defaultContent": "<button id=\"editDiscipline\" class=\"btn btn-success btn-sm\"> Edit</button>",
        }

        ],
        buttons: [
            {
                text: 'Copy',
                extend: 'copy',
                exportOptions: {
                columns: ':not(:last-child)'
                }
            },
            {
                text: 'CSV',
                extend: 'csv',
                exportOptions: {
                columns: ':not(:last-child)'
                }
            },
            {
                text: 'Excel',
                extend: 'excel',
                exportOptions: {
                columns: ':not(:last-child)'
                }
            },
            {
                text: 'Pdf',
                extend: 'pdf',
                exportOptions: {
                columns: ':not(:last-child)'
                }
            },
            {
                text: 'Print',
                extend: 'print',
                exportOptions: {
                columns: ':not(:last-child)'
                }
            },
            
        ]
    });

    //editButton clicked:
    $('#myDisciplineTable tbody').on( 'click', '#editDiscipline', function () {
        var row = $(this).parents('tr');
        var discId = myDiscipline.row( row ).data().disciplineID;
        var mistake = myDiscipline.row( row ).data().disciplineMessageSummary;
        var punishment = myDiscipline.row(row).data().disciplinePunishmentIssued;
        var admNo = myDiscipline.row(row).data().studentAdmNo;

        
        $('#disciplineModalRow').html(
            "<div class=\"modal fade\" id=\""+discId+"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"disciplineEditing\" aria-hidden=\"true\">"+
              "<div class=\"modal-dialog\" role=\"document\">"+
                  "<div class=\"modal-content\">"+
                      "<div class=\"modal-header\">"+
                          "<h5 class=\"modal-title\" id=\"disciplineEditing\">Adm no "+admNo+": Update Discipline Case</h5>"+
                          "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">"+
                              "<span aria-hidden=\"true\">&times;</span>"+
                          "</button>"+
                      "</div>"+
                      "<div class=\"modal-body\">"+
                          "<form class=\"form-row\" role=\"form\" id=\"editDisciplineForm\">"+
                                "<div class=\"form-group col-lg-12\">"+
                                    "<label for=\"studentID\">Admission No.</label>"+
                                    "<input type=\"text\" class=\"form-control\" id=\"studentID\" name=\"studentID\" readonly >"+
                                "</div>"+
                                "<div class=\"form-group col-lg-12\">"+
                                    "<label for=\"mistakeDone\">Mistake</label>"+
                                    "<textarea id=\"mistakeDone\" class=\"form-control\" type=\"text\" name=\"mistakeDone\"></textarea>"+
                                "</div>"+
                                "<div class=\"form-group col-lg-12\">"+
                                    "<label for=\"punishmentGiven\">Punishment</label>"+
                                    "<textarea id=\"punishmentGiven\" class=\"form-control\" type=\"text\" name=\"punishmentGiven\"></textarea>"+
                                "</div>"+
                                "<div class=\"form-group\" id=\"discEditLoader\" style=\"display:none\">"+
                                    "<div class=\"loading-icon\"></div>"+
                                "</div>"+
                                "<div class=\"form-group col-lg-6\" id=\"discEditLog\">"+
                                    "<input class=\"btn btn-sm btn-success\" type=\"button\" id=\"updateDiscBtn\" value=\"Submit\">"+
                                "</div>"+
                                "<div class=\"form-group col-lg-6\">"+
                                    "<button type=\"button\" class=\"btn btn-sm btn-warning\" data-dismiss=\"modal\">Close</button>"+
                                "</div>"+
                          "</form>"+
                      "</div>"+
                  "</div>"+
              "</div>"+
            "</div>"
          );


        $('#'+discId).modal('show');

        $('#mistakeDone').val(mistake);
        $('#punishmentGiven').val(punishment);
        $('#studentID').val(admNo);

        $('#updateDiscBtn').click(function (e) { 
            e.preventDefault();
            
            var mistake = $('#mistakeDone').val();
            var punishment =$('#punishmentGiven').val();

            var updateCase = {
                "disciplineMessageSummary": mistake,
                "disciplinePunishmentIssued": punishment,
                "studentAdmNo": admNo,
                "teacherInvolvedID": teacherId
            }

            myJSON = JSON.stringify(updateCase)
            JSON.parse(myJSON);

            var IsValid = $('#editDisciplineForm').valid();
            if (IsValid) {
                $.ajax({
                    type: "put",
                    url: schoolUrl+"/disciplineUpdate/"+discId,
                    data: myJSON,
                    dataType: "json",
                    contentType: 'application/json',
                    headers : {
                        "Authorization" : 'Bearer ' + token.accessToken,
                        "contentType": "application/json",
                    },
                    beforeSend: function() {
                        $('#discEditLoader').show();
                        $('#discEditLog').hide()
                    },
                    complete: function(){
                        $('#discEditLoader').hide();
                        $('#discEditLog').show();
                    },
                    processData: false,
                    success: function (response) {
                        if (response.code == 200) {
                            $("#disciplineReportFeedback").html(" <div class=\"alert alert-success alert-dismissible\" role=\"alert\">The discipline case has been updated successfully.. <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                            $('html, body').animate({
                                scrollTop: $("#disciplineReportFeedback").offset().top
                            }, 1000);
                            $('#myDisciplineTable').DataTable().ajax.reload(null, false);
                            $('#'+discId).modal('hide');
                            $("#disciplineStudent")[0].reset();
                        }else {
                            $('html, body').animate({
                                scrollTop: $("#disciplineReportFeedback").offset().top
                            }, 1000);
                            $('#'+discId).modal('hide');
                            $("#disciplineReportFeedback").html(" <div class=\"alert alert-danger alert-dismissible \" role=\"alert\">"+response.message+".<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                        }
                        checkToken();
                    },
                    error: function(){
                        $('html, body').animate({
                            scrollTop: $("#disciplineReportFeedback").offset().top
                        }, 1000);
                        $("#disciplineReportFeedback").html(" <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">Error connecting to the server. Do you have internet Connection?<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                        $('#myDisciplineTable').DataTable().ajax.reload(null, false);
                        checkToken();
                    }
                });
            }
            
        });
    });


    //Discipline:
    var discipline = $('#disciplineTable').DataTable({
        dom: 'Bfrtip',
        processing: true,
        serverSide: false,
  
        ajax : {
          type : "get",
          contentType: "application/json",
          dataType: "json",
          url : schoolUrl+"/disciplineAllForDisciplineMaster",
          headers : {
              "Authorization" : 'Bearer ' + token.accessToken,
              "contentType": "application/json",
          },
          dataSrc : "data"
        },
        columns : [
            {"data" : "studentAdmNo"},
            {"data" : "disciplineMessageSummary"},
            {"data" : "disciplinePunishmentIssued"},
            {"data" : "teacherInvolvedID"},
            {"data" : "availableToParent"},
            {"data" : ""}
        ],
        columnDefs: [ 
          {
            "targets" : [4],
            "data" : "availableToParent",
            render: function (a, b, data, d) {
                if (data.availableToParent == true) {
                    return "<span style='color:#5cb85c'>Available</span>";
                } else if (data.availableToParent == false){
                    return "<span style='color:	#d9534f'>NotAvailable</span>";
                }
                return "";
            },
          },
          {
            "targets" : [-1],
            "data" : "availableToParent",
            render: function (a, b, data, d) {
              if (data.availableToParent == true) {
                return "<button type='button' id='unavail' class='btn btn-danger btn-sm'><i class='fa fa-check'></i>Shown</button>";
              } else if (data.availableToParent == false){
                return "<button type='button' id='avail' class='btn btn-primary btn-sm'>Show</button>";
              }
              return "";
            },
          }
          
        ],
        buttons: [
            {
                text: 'Copy',
                extend: 'copy',
                exportOptions: {
                  columns: ':not(:last-child)'
                }
            },
            {
                text: 'CSV',
                extend: 'csv',
                exportOptions: {
                  columns: ':not(:last-child)'
                }
            },
            {
                text: 'Excel',
                extend: 'excel',
                exportOptions: {
                  columns: ':not(:last-child)'
                }
            },
            {
                text: 'Pdf',
                extend: 'pdf',
                exportOptions: {
                  columns: ':not(:last-child)'
                }
            },
            {
                text: 'Print',
                extend: 'print',
                exportOptions: {
                  columns: ':not(:last-child)'
                }
            },
            
        ]
    });
  
    //Avail to Parent:
    $('#disciplineTable tbody').on( 'click', '#avail', function () {
        var row  = $(this).parents('tr'); // The <tr>
        var disciplineID = discipline.row( row ).data().disciplineID;

        $('#disciplineModalRow').append(
            "<div class=\"modal fade\" id=\""+disciplineID+"\"  data-backdrop=\"static\" data-keyboard=\"false\">"+
                "<div class=\"modal-dialog modal-sm\">"+
                    "<div class=\"modal-content\">"+
                        "<div class=\"modal-body\">"+
                            "<p style=\"text-align:center;\">Are you sure you want to avail the discipline to the parent? The action is irreversible.</p>"+
                            "<hr />"+
                            "<button type=\"button\" class=\"btn btn-danger btn-sm pull-left\" data-dismiss=\"modal\">No</button>"+
                            "<button type=\"button\" class=\"btn btn-success btn-sm pull-right\" data-dismiss=\"modal\" id=\""+disciplineID+"avail\">Yes</button>"+
                            "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"
        );

        $('#'+disciplineID).modal('show');

        $('#'+disciplineID+'avail').click(function (e) { 
            $.ajax({
            type: "put",
            url: schoolUrl+"/disciplineMasterAvailToParent/"+disciplineID,
            dataType: "json",
            contentType: 'application/json',
            headers : {
                "Authorization" : 'Bearer ' + token.accessToken,
                "contentType": "application/json",
            },
            processData: false,
            success: function (response) {
                if(response.code == 200){
                    $('html, body').animate({
                        scrollTop: $("#disciplineReportFeedback").offset().top
                      }, 1000);
                    $("#disciplineReportFeedback").html(" <div class=\"alert alert-success alert-dismissible\" role=\"alert\">Exam succesfully opened. <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                    $('#disciplineTable').DataTable().ajax.reload(null, false);
                }else{
                    $('html, body').animate({
                        scrollTop: $("#disciplineReportFeedback").offset().top
                    }, 1000);
                    $("#disciplineReportFeedback").html(" <div class=\"alert alert-danger alert-dismissible \" role=\"alert\">"+response.message+".<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                }
                checkToken();
            },
            error: function() {
                $('html, body').animate({
                    scrollTop: $("#disciplineReportFeedback").offset().top
                }, 1000);
                $("#disciplineReportFeedback").html(" <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">Error connecting to the server. Do you have internet Connection?<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                checkToken();
            }
            });
        });

    });
  
});

    
    //Display Student:
    function showStudent(Id) {
        $.ajax({
            type: "get",
            url: schoolUrl+"/student/"+Id,
            dataType: "json",
            contentType: 'application/json',
            headers : {
                "Authorization" : 'Bearer ' + token.accessToken,
                "contentType": "application/json",
            },
            beforeSend: function() {
                $('#discStudentLoader').show();
                $('#discStudentLog').hide()
            },
            complete: function(){
                $('#discStudentLoader').hide();
                $('#discStudentLog').show();
            },
            success: function (response) {
                data = response.data;
                // $('#formRow').hide();
                if (response.code == 200) {
                    var profile = '<img src="data:image/xyz;base64,'+ data.studentPhoto + '" style="border-radius: 50%;" width="75%" height="100%">';
                    profile += '<p >'+data.studentName+'</p>';
                    $('#studentProfile').html(profile);
                    $('#reportingForm').show();
                    $('#studentId').val(data.studentAdminNo);
                    $('html,body').animate({
                        scrollTop: $("#reportingForm").offset().top},
                    'slow');
                }else {
                    $('html, body').animate({
                        scrollTop: $("#disciplineReportFeedback").offset().top
                    }, 1000);
                    $("#disciplineReportFeedback").html(" <div class=\"alert alert-danger alert-dismissible \" role=\"alert\">"+response.message+".<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                }
                checkToken();
            },
            error: function (response) {
                $('html, body').animate({
                    scrollTop: $("#disciplineReportFeedback").offset().top
                }, 1000);
                $("#studentProfile").hide();
                $("#disciplineReportFeedback").html(" <div class=\"alert alert-danger alert-dismissible \" role=\"alert\">The student does not exist.<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>");
                checkToken();
            }

        });
    }