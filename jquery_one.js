
$('#examNav').addClass("active");
document.getElementById("pageName").textContent = "Correct Marks";
$('#analysisCard').css({
    "background-color":"rgba(229,57,53,0.7)"
});

$('#cardCorrect').css({
    "box-shadow": "0px 6px 10px 1px rgba(0, 0, 0, 0.5)"
});

function getStudentCurrentMark(studentDetails){
    $('.spinner-border ').show()
    $.ajax({
        url: schoolUrl+'/addMarksForZulpha?classNo='+studentDetails.classNo+"&examID="+studentDetails.examID+"&streamID="+studentDetails.streamID+"&subjectCode="+studentDetails.subjectCode,
        method: 'get',
        headers: {"Authorization" :  'Bearer ' + token.accessToken}
    }).done(function(response){
        $('.spinner-border ').hide()
        if(response.code == 200){
            let filteredStudent = response.data.filter(function(studentData){
                return studentDetails.studentAdmNoArr.includes(studentData.studentadmNo)
            })
            if(filteredStudent.length > 0){
                $('#foundStudents').html("Found "+filteredStudent.length+" of "+studentDetails.studentAdmNoArr.length+" inputed students.")
                $("#marksTableDiv").html(
                    "<table id='marksTable'>"+
                        "<tr>"+
                            "<th >Admission Number</th>"+
                            "<th >Name</th>"+
                            "<th >Marks</th>"+
                        "</tr>"+
                    "</table>"
                );
                $.each(filteredStudent, function () {
                    $("#marksTable").append(
                        "<tr class='tableRow'>"+
                            "<td class='studentAdmNo'>"+this.studentadmNo+"</td>"+
                            "<td class='studentName'>"+this.studentName+"</td>"+
                            "<td contenteditable class='studentMarks'>"+this.rawMarks+"</td>"+
                        "</tr>"
                    );
                });
    
                $('#updateMarks').html(
                    "<button class='btn btn-sm btn-success float-right' id='findStudentsButton' style='margin-top:1%' onclick='updateDetails("+studentDetails.examID+","+studentDetails.subjectCode+")'>Update Marks</button>"
                )
            }else{
                $('#foundStudents').html("Found "+filteredStudent.length+" of "+studentDetails.studentAdmNoArr.length+" inputed students.")
                $('#marksTableDiv').html(
                    "<div class=\"alert alert-danger alert-dismissible fade show\" id=\"marksFeedbackAlert\" role=\"alert\">"+
                        "<strong>No student marks found for the selected students. Kindly confirm if the students were enrolled.</strong>"+
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                            "<span aria-hidden=\"true\">&times;</span>"+
                        "</button>"+
                    "</div>"
                )
            }

        }else{
            $('#foundStudents').html(
                "<p class='text text-danger'>"+response.message+"</p>"
            )
        }
    }).fail(function(error){
        $('.spinner-border ').hide()
        $('#foundStudents').html(
            "<p class='text text-danger'> Unable to fetch student marks. Kindly check your imternet. If your internet is ok please re-login again.</p>"
        )
    })
}

function updateStudentMarks(updatedMarks){
    updatedMarks = {
        "allMarks":updatedMarks
    }

    $.ajax({
        url: schoolUrl+'/addMarks',
        method: 'post',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(updatedMarks),
        headers: {"Authorization" :  'Bearer ' + token.accessToken}
    }).done(function(response){
        if(response.code == 200){
            $('#updateMarksFeedback').html(
                "<div class=\"alert alert-success alert-dismissible fade show\" id=\"marksFeedbackAlert\" role=\"alert\">"+
                    "<strong>SUCCESS !!</strong> Marks Updated Succesfuly"+
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                        "<span aria-hidden=\"true\">&times;</span>"+
                    "</button>"+
                "</div>"
            )
        }else{
            $('#updateMarksFeedback').html(
                "<div class=\"alert alert-danger alert-dismissible fade show\" id=\"marksFeedbackAlert\" role=\"alert\">"+
                    "<strong>ERROR !!</strong> Ensure you put marks thats within the grading system."+response.message+
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                        "<span aria-hidden=\"true\">&times;</span>"+
                    "</button>"+
                "</div>"
            )
        }
    }).fail(function(error){
        $('#updateMarksFeedback').html(
            "<div class=\"alert alert-danger alert-dismissible fade show\" id=\"marksFeedbackAlert\" role=\"alert\">"+
                "<strong>ERROR !!</strong> Do you have internet? If you do your session may have expired, please login again."+error.statusText+
                    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                    "<span aria-hidden=\"true\">&times;</span>"+
                "</button>"+
            "</div>"
        )
    })
}

function getOpenExams(){
    $.ajax({
        url: schoolUrl+'/openExam',
        method: 'get',
        headers: {"Authorization" : 'Bearer ' + token.accessToken}
    }).done(function(response) {
        if(response.code == 200){
            $.each(response.data, function () {
                let examDetails = this.examName + " Term "+this.examTerm+" Year "+this.examYear
                $("#openExams").append($('<option>', {
                    value: this.examID,
                    text: examDetails
                }));
            });
        }else{
            $('#apiCallsDetails').html(
                "<div class=\"alert alert-danger alert-dismissible fade show\" id=\"marksFeedbackAlert\" role=\"alert\">"+
                    "<strong>ERROR !! </strong>"+response.message+
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                        "<span aria-hidden=\"true\">&times;</span>"+
                    "</button>"+
                "</div>"
            )
        }
    })
    .fail(function(error){
        $('#apiCallsDetails').html(
            "<div class=\"alert alert-danger alert-dismissible fade show\" id=\"marksFeedbackAlert\" role=\"alert\">"+
                "<strong>ERROR !! Do you have internet connection? If you do, kindly login again as your session may have expired.</strong>"+error.statusText+
                    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                    "<span aria-hidden=\"true\">&times;</span>"+
                "</button>"+
            "</div>"
        )
    })   
}

function getClasses(){
    $.ajax({
        url: schoolUrl+'/class',
        method: 'get',
        headers: {"Authorization" : 'Bearer ' + token.accessToken}
    }).done(function(response) {
        if(response.code == 200){
            $.each(response.data, function () {
                $("#classes").append($('<option>', {
                    value: this.classNo,
                    text: this.className
                }));
            }); 
        }else{
            $("#classes").append($('<option>', {
                text: response.message
            }));
        }
    })
    .fail(function(error){
        $('#classMessage').html(
            "<h6 class=\"text-center text-danger\">UNABLE TO GET CLASSES: Your Session May Have Expired. Please Login Again "+error.statusText+" </h6>"
        )
    })
}

function getStream(){
    $.ajax({
        url: schoolUrl+'/stream',
        method: 'get',
        headers: {"Authorization" :'Bearer ' + token.accessToken}
    }).done(function(response) {
        if(response.code == 200){
            $.each(response.data, function () {
                $("#streams").append($('<option>', {
                    value: this.streamID,
                    text: this.streamName
                }));
            }); 
        }else{
            $("#classes").append($('<option>', {
                text: response.message
            }));
        }
    })
    .fail(function(error){
        $('#classMessage').html(
            "<h6 class=\"text-center text-danger\">UNABLE TO GET CLASSES: Your Session May Have Expired. Please Login Again "+error.statusText+" </h6>"
        )
    })
}

function getSubjects(){
    $.ajax({
        url: schoolUrl+'/subjects',
        method: 'get',
        headers: {"Authorization" : 'Bearer ' + token.accessToken}
    }).done(function(response) {
        if(response.code == 200){
            $.each(response.data, function () {
                $("#subjects").append($('<option>', {
                    value: this.subjectCode,
                    text: this.subjectName
                }));
            }); 
        }else{
            $("#classes").append($('<option>', {
                text: response.message
            }));
        }
    })
    .fail(function(error){
        $('#classMessage').html(
            "<h6 class=\"text-center text-danger\">UNABLE TO GET CLASSES: Your Session May Have Expired. Please Login Again "+error.statusText+" </h6>"
        )
    })
}

function updateDetails(examID,subjectCode){
    $('#marksFeedbackAlert').alert('close')
    let updatedMarksArray = new Array()
    let state = true
     
    $("#marksTable tr").each(function(row, tr) {
        if(!/^\d+$/.test($(tr).find('td:eq(2)').text()) && row != 0){
            $('#updateMarksFeedback').html(
                "<div class=\"alert alert-danger alert-dismissible fade show\" id=\"marksFeedbackAlert\" role=\"alert\">"+
                    "<strong>You seem to have input a non integer value or an empty value in the marks section. If the value is 'null' kindly get the students again eliminating the one with null mark from the list of admission numbers for it to submit or asign the null student a valid mark.</strong>"+
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                        "<span aria-hidden=\"true\">&times;</span>"+
                    "</button>"+
                "</div>"
            )
            state = false
            return
        }else{
            updatedMarksArray[row]={
                "studentAdmNo" : $(tr).find('td:eq(0)').text(),
                "studentMark" : $(tr).find('td:eq(2)').text(),
                "subjectCode" : subjectCode,
                "examID": examID 
            }
        }
    })

    if(state){
        updatedMarksArray.shift()
        updateStudentMarks(updatedMarksArray)
    }
}

getOpenExams()
getClasses()
getStream()
getSubjects()

$('#filledMarksForm').submit(function(e){
    e.preventDefault()
    $('#marksFeedbackAlert').alert('close')
    $('tr').remove()
    $('#findStudentsButton').remove()
    $('#missingAdmNo').hide()
    $('#missingClass').hide()
    $('#missingSubject').hide()
    $('#missingStream').hide()
    $('#missingExam').hide()

    let classNo = $('#classes').val()
    let streamID = $('#streams').val()
    let subjectCode = $('#subjects').val()
    let studentAdmNo = $('#admNo').val()
    let examID = $('#openExams').val()

    if(classNo && streamID && subjectCode && examID && studentAdmNo){
        let studentAdmNoArr = studentAdmNo.split(',').filter(item => item)

        let studentDetails = {
            "classNo": classNo,
            "examID": examID,
            "streamID":streamID,
            "subjectCode": subjectCode,
            "studentAdmNoArr": studentAdmNoArr
        }
    
        getStudentCurrentMark(studentDetails)
    }
    else{
        if(!classNo){
            $('#missingClass').show()
        }
        if(!streamID){
            $('#missingStream').show()
        }
        if(!subjectCode){
            $('#missingSubject').show()
        }
        if(!examID){
            $('#missingExam').show()
        }
        if(!studentAdmNo){
            $('#missingAdmNo').show()
        }
    }

})